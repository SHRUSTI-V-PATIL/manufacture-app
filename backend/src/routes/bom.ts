import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => { res.json({ success: true, message: 'BOM endpoint - to be implemented' }); });
export default router;
