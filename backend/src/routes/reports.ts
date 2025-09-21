import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => { res.json({ success: true, message: 'Reports endpoint - to be implemented' }); });
export default router;
