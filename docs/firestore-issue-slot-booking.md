## Firestore permission issue in `slot-booking`

**Issue:**  
The new `slot-booking` app was using different Firestore collections (`users`, `slots`, `leaves`) and Firebase Auth, while the existing `bookmyslot` app – and the Firestore rules/data – used `admin`, `candidates`, `events`, and `adminLeaves`. As a result, unauthenticated reads to `users`, `slots`, and `leaves` failed with `FirebaseError: Missing or insufficient permissions`, and `AuthContext` always logged `Auth state changed: no user`.

**Solution (alignment with `bookmyslot`):**
- Pointed all slot/calendar logic to the shared `events` collection and made `slotDocToUI`/`slotToCalendarEvent` compatible with the existing `events` schema (`start`/`end`, `date`, `status`).
- Switched leave handling to the shared `adminLeaves` collection and normalized dates to `YYYY-MM-DD` strings for the new UI.
- Replaced the `users`-based login with the existing `admin`/`candidates` mobile+password model, reusing the same `localStorage` keys (`user`, `adminToken`, `candidates`, etc.) and also setting `sb_user` for this app.
- Simplified `AuthContext` to derive `currentUser` and `role` from the `sb_user` session instead of Firebase Auth, so route guards and dashboards work off the same session as `bookmyslot`.

