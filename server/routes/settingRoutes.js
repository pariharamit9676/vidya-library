import { Router } from 'express';
import { SettingController } from '../controllers/settingController.js';

const router = Router();

router.get('/', SettingController.get);
router.put('/', SettingController.update);
router.post('/', SettingController.update);

export default router;
