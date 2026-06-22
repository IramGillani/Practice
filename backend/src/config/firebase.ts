import {
  initializeApp,
  cert,
  getApp,
  getApps,
  ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../../serviceAccountKey.json";

const app =
  getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount as ServiceAccount) })
    : getApp();

export const adminAuth = getAuth(app);
export default app;
