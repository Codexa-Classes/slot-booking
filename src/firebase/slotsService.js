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
} from 'firebase/firestore';
import { db } from './firebase';

const SLOTS_COLLECTION = 'slots';

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
    return slotDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Convert Firestore slot document to UI format
 */
function slotDocToUI(docSnapshot) {
  const data = docSnapshot.data();
  const id = docSnapshot.id;

  // Parse date
  const slotDate = data.date?.toDate ? data.date.toDate() : new Date(data.date);
  const startHour = String(data.startHour || 0).padStart(2, '0');
  const startMinute = String(data.startMinute || 0).padStart(2, '0');

  return {
    id,
    firestoreId: id,
    candidateId: data.candidateId || '',
    candidateName: data.candidateName || '',
    hrId: data.hrId || '',
    hrName: data.hrName || '',
    company: data.company || '',
    technology: data.technology || '',
    round: data.round || '',
    date: slotDate,
    startHour: data.startHour,
    startMinute: data.startMinute,
    duration: data.duration || 30,
    status: data.status || 'Pending',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    // Formatted labels for UI
    dateLabel: formatDateLabel(data.date),
    timeLabel: formatTimeLabel(
      data.startHour,
      data.startMinute,
      data.duration,
    ),
    createdAtLabel: formatCreatedAt(data.createdAt),
  };
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
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const lastWeekSlots = allSlots.filter((slot) => {
      const slotDate = slot.date?.toDate ? slot.date.toDate() : new Date(slot.date);
      return slotDate >= oneWeekAgo && slotDate < now;
    });

    const thisWeekSlots = allSlots.filter((slot) => {
      const slotDate = slot.date?.toDate ? slot.date.toDate() : new Date(slot.date);
      return slotDate >= now;
    });

    // Calculate average slots per week (last 4 weeks)
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
    const recentSlots = allSlots.filter((slot) => {
      const slotDate = slot.date?.toDate ? slot.date.toDate() : new Date(slot.date);
      return slotDate >= fourWeeksAgo;
    });
    const avgPerWeek = recentSlots.length / 4;

    // Calculate average slots per day (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dailySlots = allSlots.filter((slot) => {
      const slotDate = slot.date?.toDate ? slot.date.toDate() : new Date(slot.date);
      return slotDate >= thirtyDaysAgo;
    });
    const avgPerDay = dailySlots.length / 30;

    return {
      total: allSlots.length,
      lastWeek: lastWeekSlots.length,
      thisWeek: thisWeekSlots.length,
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
