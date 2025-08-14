import WikiDataTestController from '../../controllers/WikiDataTestController.js';
import { Router } from 'express';
import { processAiTest } from '../../services/aiService.js';
const router = Router();

router.get('/mig-data/test', WikiDataTestController.getData);

router.post('/mig-data/test/ai', async (req, res) => {
  const { question } = req.body;
  try {
    const result = await processAiTest(question);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error testing AI model:', error);
    res.status(500).json({
      message: 'Failed to test AI model.',
      error: error.message,
    });
  }
});

router.get('/wikiTable',WikiDataTestController.getWikiTable);


router.post('/create/check',WikiDataTestController.addWiki);

export default router;
