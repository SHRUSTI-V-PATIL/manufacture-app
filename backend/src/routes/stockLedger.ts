import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => { res.json({ success: true, message: 'Stock Ledger endpoint - to be implemented' }); });
export default router;
