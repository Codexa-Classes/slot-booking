import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

const SLOTS_COLLECTION = 'slots';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Format date as DD-MMM-YYYY (e.g. 21-Feb-2026). Use everywhere for consistent display.
 */
export function formatDateDDMMYYYY(dateVal) {
  if (!dateVal) return '';
  const d = dateVal?.toDate ? dateVal.toDate() : new Date(dateVal);
  if (Number.isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Convert an approved slot to calendar event format for SlotCalendar.
 * Expects slot with: date (Date), startHour, startMinute, duration, candidateName, company.
 */
export function slotToCalendarEvent(slot) {
  const d = slot.date?.toDate ? slot.date.toDate() : new Date(slot.date);
  const start = new Date(d);
  start.setHours(slot.startHour ?? 0, slot.startMinute ?? 0, 0, 0);
  const end = new Date(start.getTime() + (slot.duration || 30) * 60 * 1000);
  const title = [slot.candidateName || slot.name || 'Slot', slot.company].filter(Boolean).join(' - ');
  return {
    id: slot.id || slot.firestoreId,
    start: start.toISOString(),
    end: end.toISOString(),
    title: title || 'Interview',
  };
}

/**
 * Subscribe to approved slots and call callback with calendar events.
 * Returns unsubscribe function.
 */
export function subscribeToApprovedSlots(callback) {
  const slotsRef = collection(db, SLOTS_COLLECTION);
  const q = query(
    slotsRef,
    where('status', '==', 'Approved'),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const slots = snapshot.docs.map((d) => slotDocToUI(d));
      const events = slots.map(slotToCalendarEvent);
      callback(events);
    },
    (err) => {
      console.error('Error subscribing to approved slots:', err);
      callback([]);
    },
  );
}

/**
 * Subscribe to all slots (any status) and call callback with calendar events.
 * Returns unsubscribe function.
 */
export function subscribeToAllSlots(callback) {
  const slotsRef = collection(db, SLOTS_COLLECTION);
  return onSnapshot(
    slotsRef,
    (snapshot) => {
      const slots = snapshot.docs.map((d) => slotDocToUI(d));
      const events = slots.map(slotToCalendarEvent);
      callback(events);
    },
    (err) => {
      console.error('Error subscribing to all slots:', err);
      callback([]);
    },
  );
}

/**
 * Format timestamp to readable date label
 */
function formatDateLabel(date) {
  const now = new Date();
  const slotDate = date.toDate ? date.toDate() : new Date(date);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const slotDay = new Date(
    slotDate.getFullYear(),
    slotDate.getMonth(),
    slotDate.getDate(),
  );

  if (slotDay.getTime() === today.getTime()) {
    return 'Today';
  } else if (slotDay.getTime() === tomorrow.getTime()) {
    return 'Upcoming (Tomorrow)';
  } else if (slotDay > now) {
    const daysDiff = Math.ceil((slotDay - today) / (1000 * 60 * 60 * 24));
    return `Upcoming (In ${daysDiff} days)`;
  } else {
    return formatDateDDMMYYYY(slotDate);
  }
}

/**
 * Format timestamp to readable time label
 */
function formatTimeLabel(hour, minute, duration) {
  const startHour = parseInt(hour, 10);
  const startMin = parseInt(minute, 10);
  const durationMins = parseInt(duration, 10);

  const startHour12 = startHour % 12 === 0 ? 12 : startHour % 12;
  const startAmPm = startHour < 12 ? 'AM' : 'PM';
  const startMinStr = String(startMin).padStart(2, '0');

  const endTime = new Date();
  endTime.setHours(startHour, startMin + durationMins, 0, 0);
  const endHour = endTime.getHours();
  const endHour12 = endHour % 12 === 0 ? 12 : endHour % 12;
  const endAmPm = endHour < 12 ? 'AM' : 'PM';
  const endMinStr = String(endTime.getMinutes()).padStart(2, '0');

  let durationLabel = '';
  if (durationMins < 60) {
    durationLabel = `${durationMins} mins`;
  } else {
    const hours = Math.floor(durationMins / 60);
    const mins = durationMins % 60;
    durationLabel =
      mins > 0 ? `${hours} Hour ${mins} mins` : `${hours} Hour`;
  }

  return `${startHour12}:${startMinStr} ${startAmPm} – ${endHour12}:${endMinStr} ${endAmPm} (${durationLabel})`;
}

/**
 * Format createdAt to exact date and time (e.g. "21 Feb 2026, 3:45 PM")
 */
function formatCreatedAtExact(timestamp) {
  if (!timestamp) return '–';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const dateStr = formatDateDDMMYYYY(date);
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${dateStr}, ${timeStr}`;
}

/**
 * Format slot date to exact date (e.g. "21 Feb 2026")
 */
function formatDateExact(date) {
  if (!date) return '–';
  const d = date.toDate ? date.toDate() : new Date(date);
  const str = formatDateDDMMYYYY(d);
  return str || '–';
}

/**
 * Format createdAt timestamp to readable string
 */
function formatCreatedAt(timestamp) {
  if (!timestamp) return 'Recently';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `Recently, ${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) {
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `Recently, ${timeStr}`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDateDDMMYYYY(date);
}

/**
 * Convert Firestore slot document to UI format.
 * Supports both admin format (startHour, startMinute, company) and legacy candidate format (time string, companyName).
 */
function slotDocToUI(docSnapshot) {
  const data = docSnapshot.data();
  const id = docSnapshot.id;

  // Parse date: Timestamp, Date, or ISO/date string
  let slotDate;
  if (data.date?.toDate) {
    slotDate = data.date.toDate();
  } else if (data.date instanceof Date) {
    slotDate = data.date;
  } else {
    slotDate = new Date(data.date && typeof data.date === 'string' ? data.date + 'T00:00:00' : data.date);
  }

  // startHour/startMinute: use if present, else parse from time string (e.g. "14:30")
  let startHour = data.startHour;
  let startMinute = data.startMinute;
  if (startHour == null && data.time) {
    const parts = String(data.time).trim().split(':');
    startHour = parseInt(parts[0], 10) || 0;
    startMinute = parseInt(parts[1], 10) || 0;
  }
  startHour = startHour != null ? startHour : 0;
  startMinute = startMinute != null ? startMinute : 0;

  const company = data.company || data.companyName || '';
  const duration = data.duration != null ? Number(data.duration) : 30;

  return {
    id,
    firestoreId: id,
    candidateId: data.candidateId || '',
    candidateName: data.candidateName || '',
    hrId: data.hrId || '',
    hrName: data.hrName || '',
    hrEmail: data.hrEmail || '',
    hrMobile: data.hrMobile || '',
    company,
    technology: data.technology || '',
    round: data.round || '',
    date: slotDate,
    startHour,
    startMinute,
    duration,
    status: data.status || 'Pending',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    // Formatted labels for UI
    dateLabel: formatDateLabel(slotDate),
    dateExactLabel: formatDateExact(slotDate),
    timeLabel: formatTimeLabel(startHour, startMinute, duration),
    createdAtLabel: formatCreatedAt(data.createdAt),
    createdAtExactLabel: formatCreatedAtExact(data.createdAt),
  };
}

/** Convert a Firestore query snapshot of slots to UI format (for real-time listener). */
export function slotsSnapshotToUI(snapshot) {
  return snapshot.docs.map((d) => slotDocToUI(d));
}

/**
 * Fetch slots for a given date (YYYY-MM-DD) for availability check.
 * Returns minimal time info: startHour, startMinute, duration (in minutes from midnight).
 */
export async function getSlotsForDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return [];
  try {
    const startOfDay = new Date(dateStr + 'T00:00:00');
    const endOfDay = new Date(dateStr + 'T23:59:59.999');
    const startTimestamp = Timestamp.fromDate(startOfDay);
    const endTimestamp = Timestamp.fromDate(endOfDay);

    const slotsRef = collection(db, SLOTS_COLLECTION);
    const q = query(
      slotsRef,
      where('date', '>=', startTimestamp),
      where('date', '<=', endTimestamp),
    );
    const snapshot = await getDocs(q);

    const result = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      let startHour = data.startHour;
      let startMinute = data.startMinute;
      if (startHour == null && data.time) {
        const parts = String(data.time).trim().split(':');
        startHour = parseInt(parts[0], 10) || 0;
        startMinute = parseInt(parts[1], 10) || 0;
      }
      startHour = startHour != null ? startHour : 0;
      startMinute = startMinute != null ? startMinute : 0;
      const duration = data.duration != null ? Number(data.duration) : 30;
      result.push({ startHour, startMinute, duration });
    });
    return result;
  } catch (error) {
    console.error('Error fetching slots for date:', error);
    return [];
  }
}

/**
 * Check if a requested time range overlaps any existing slots on the same date.
 * Requested: startHour, startMinute, duration (minutes).
 * Returns true if slot is available (no overlap).
 */
export function isSlotAvailable(existingSlots, startHour, startMinute, durationMins) {
  const reqStart = parseInt(startHour, 10) * 60 + parseInt(startMinute, 10);
  const reqEnd = reqStart + parseInt(durationMins, 10);

  for (const slot of existingSlots) {
    const sh = slot.startHour != null ? slot.startHour : 0;
    const sm = slot.startMinute != null ? slot.startMinute : 0;
    const dur = slot.duration != null ? slot.duration : 30;
    const exStart = sh * 60 + sm;
    const exEnd = exStart + dur;
    if (reqStart < exEnd && reqEnd > exStart) return false;
  }
  return true;
}

/**
 * Fetch all slots from Firestore
 */
export async function getAllSlots() {
  try {
    const slotsRef = collection(db, SLOTS_COLLECTION);
    const q = query(slotsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const slots = [];
    querySnapshot.forEach((doc) => {
      slots.push(slotDocToUI(doc));
    });

    return slots;
  } catch (error) {
    console.error('Error fetching slots:', error);
    throw error;
  }
}

/**
 * Fetch slots by status
 */
export async function getSlotsByStatus(status) {
  try {
    const slotsRef = collection(db, SLOTS_COLLECTION);
    const q = query(
      slotsRef,
      where('status', '==', status),
      orderBy('createdAt', 'desc'),
    );
    const querySnapshot = await getDocs(q);

    const slots = [];
    querySnapshot.forEach((doc) => {
      slots.push(slotDocToUI(doc));
    });

    return slots;
  } catch (error) {
    console.error('Error fetching slots by status:', error);
    throw error;
  }
}

/**
 * Fetch slots by candidate ID
 */
export async function getSlotsByCandidate(candidateId) {
  try {
    const slotsRef = collection(db, SLOTS_COLLECTION);
    const q = query(
      slotsRef,
      where('candidateId', '==', candidateId),
      orderBy('createdAt', 'desc'),
    );
    const querySnapshot = await getDocs(q);

    const slots = [];
    querySnapshot.forEach((doc) => {
      slots.push(slotDocToUI(doc));
    });

    return slots;
  } catch (error) {
    console.error('Error fetching slots by candidate:', error);
    throw error;
  }
}

/**
 * Fetch slots by candidate name (for search)
 */
export async function getSlotsByCandidateName(candidateName) {
  try {
    const slotsRef = collection(db, SLOTS_COLLECTION);
    const q = query(
      slotsRef,
      where('candidateName', '>=', candidateName),
      where('candidateName', '<=', candidateName + '\uf8ff'),
      orderBy('candidateName'),
      orderBy('createdAt', 'desc'),
    );
    const querySnapshot = await getDocs(q);

    const slots = [];
    querySnapshot.forEach((doc) => {
      slots.push(slotDocToUI(doc));
    });

    return slots;
  } catch (error) {
    console.error('Error fetching slots by candidate name:', error);
    // Fallback: fetch all and filter client-side
    const allSlots = await getAllSlots();
    return allSlots.filter((slot) =>
      slot.candidateName.toLowerCase().includes(candidateName.toLowerCase()),
    );
  }
}

/**
 * Create a new slot booking
 */
export async function createSlot(slotData) {
  try {
    const {
      candidateId,
      candidateName,
      hrId,
      hrName,
      company,
      technology,
      round,
      date, // Date object or string
      startHour,
      startMinute,
      duration,
    } = slotData;

    // Convert date to Firestore Timestamp
    let dateTimestamp;
    if (date instanceof Date) {
      dateTimestamp = Timestamp.fromDate(date);
    } else if (typeof date === 'string') {
      dateTimestamp = Timestamp.fromDate(new Date(date));
    } else {
      throw new Error('Invalid date format');
    }

    const slotRef = collection(db, SLOTS_COLLECTION);
    const newSlot = {
      candidateId: candidateId || '',
      candidateName: candidateName || '',
      hrId: hrId || '',
      hrName: hrName || '',
      company: company || '',
      technology: technology || '',
      round: round || '',
      date: dateTimestamp,
      startHour: parseInt(startHour, 10),
      startMinute: parseInt(startMinute, 10),
      duration: parseInt(duration, 10),
      status: 'Pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(slotRef, newSlot);
    console.log('Slot created with ID:', docRef.id);

    // Fetch and return the created slot
    const docSnapshot = await getDoc(docRef);
    return slotDocToUI(docSnapshot);
  } catch (error) {
    console.error('Error creating slot:', error);
    throw error;
  }
}

/**
 * Update slot status (Approve/Reject)
 */
export async function updateSlotStatus(slotId, status) {
  try {
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      throw new Error('Invalid status. Must be Pending, Approved, or Rejected');
    }

    const slotRef = doc(db, SLOTS_COLLECTION, slotId);
    await updateDoc(slotRef, {
      status,
      updatedAt: serverTimestamp(),
    });

    // Fetch and return updated slot
    const docSnapshot = await getDoc(slotRef);
    return slotDocToUI(docSnapshot);
  } catch (error) {
    console.error('Error updating slot status:', error);
    throw error;
  }
}

/**
 * Delete a slot
 */
export async function deleteSlot(slotId) {
  try {
    const slotRef = doc(db, SLOTS_COLLECTION, slotId);
    await deleteDoc(slotRef);
    console.log('Slot deleted:', slotId);
    return true;
  } catch (error) {
    console.error('Error deleting slot:', error);
    throw error;
  }
}

/**
 * Get slot statistics
 */
export async function getSlotStatistics() {
  try {
    const allSlots = await getAllSlots();
    const now = new Date();

    // Normalize to start of today
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    // Define calendar weeks starting on Monday
    const startOfWeek = new Date(startOfToday);
    const day = startOfWeek.getDay(); // 0 (Sun) .. 6 (Sat)
    const diffToMonday = (day + 6) % 7; // 0 if Monday, 1 if Tuesday, etc.
    startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);

    const startOfNextWeek = new Date(startOfWeek);
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const getSlotDateOnly = (slot) => {
      const d = slot.date?.toDate ? slot.date.toDate() : new Date(slot.date);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    };

    // Only consider approved slots for statistics
    const approvedSlots = allSlots.filter((slot) => slot.status === 'Approved');

    // Last Week: previous calendar week (Mon–Sun)
    const lastWeekSlots = allSlots.filter((slot) => {
      const slotDate = getSlotDateOnly(slot);
      return slotDate >= startOfLastWeek && slotDate < startOfWeek;
    });

    // This Week: current calendar week (full Mon–Sun)
    const thisWeekSlots = allSlots.filter((slot) => {
      const slotDate = getSlotDateOnly(slot);
      return slotDate >= startOfWeek && slotDate < startOfNextWeek;
    });

    // Average per week over the last 4 calendar weeks (including this week)
    const startOfFourWeeksAgo = new Date(startOfWeek);
    startOfFourWeeksAgo.setDate(startOfFourWeeksAgo.getDate() - 21); // 3 weeks before current week

    const fourWeekSlots = approvedSlots.filter((slot) => {
      const slotDate = getSlotDateOnly(slot);
      return slotDate >= startOfFourWeeksAgo && slotDate < startOfNextWeek;
    });
    const avgPerWeek = fourWeekSlots.length / 4;

    // Average per day over the last 30 days (including today)
    const thirtyDaysAgo = new Date(startOfToday);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const dailySlots = approvedSlots.filter((slot) => {
      const slotDate = getSlotDateOnly(slot);
      return slotDate >= thirtyDaysAgo && slotDate < endOfToday;
    });
    const avgPerDay = dailySlots.length / 30;

    return {
      total: approvedSlots.length,
      lastWeek: lastWeekSlots.filter((s) => s.status === 'Approved').length,
      thisWeek: thisWeekSlots.filter((s) => s.status === 'Approved').length,
      avgPerWeek: Math.round(avgPerWeek * 10) / 10,
      avgPerDay: Math.round(avgPerDay * 10) / 10,
      pending: allSlots.filter((s) => s.status === 'Pending').length,
      approved: allSlots.filter((s) => s.status === 'Approved').length,
      rejected: allSlots.filter((s) => s.status === 'Rejected').length,
    };
  } catch (error) {
    console.error('Error calculating slot statistics:', error);
    throw error;
  }
}

// --- Admin Leaves (block slot booking on these dates) ---
const LEAVES_COLLECTION = 'leaves';

/**
 * Get all leave dates from Firestore. Returns array of { id, date } where date is YYYY-MM-DD.
 */
export async function getLeaves() {
  try {
    const ref = collection(db, LEAVES_COLLECTION);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((d) => ({
      id: d.id,
      date: d.data().date || '',
      dateLabel: d.data().dateLabel || '',
    }));
  } catch (err) {
    console.error('Error loading leaves:', err);
    return [];
  }
}

/**
 * Add a leave day. dateStr should be YYYY-MM-DD, dateLabel is for display.
 */
export async function addLeave(dateStr, dateLabel) {
  const ref = collection(db, LEAVES_COLLECTION);
  const docRef = await addDoc(ref, {
    date: dateStr,
    dateLabel: dateLabel || dateStr,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Delete a leave by Firestore document id.
 */
export async function deleteLeave(id) {
  await deleteDoc(doc(db, LEAVES_COLLECTION, id));
}
