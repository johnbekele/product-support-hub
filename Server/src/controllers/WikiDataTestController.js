import Content from '../model/contentModel.js';

const getData = async (_, res) => {
  try {
    const wikiData = await Content.find();
    res.status(200).json(wikiData);
  } catch (error) {
    console.error('Error importing wiki data:', error);
    res
      .status(500)
      .json({ message: 'Failed to import wiki data.', error: error.message });
  }
};

export default {
  getData,
};
