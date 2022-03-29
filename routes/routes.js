const express = require("express");
const AnimeApi = require('../services/api_services');

const router = express.Router();

router.get('/', AnimeApi.home);
router.get('/ongoing', AnimeApi.showOngoing);
router.get('/ongoing/:page', AnimeApi.showOngoing)
router.get('/complete', AnimeApi.showFinish);
router.get('/complete/:page', AnimeApi.showFinish);
router.get('/anime/:id', AnimeApi.showAnime);
router.get('/eps/:id', AnimeApi.animeEps);
router.get('/search/:title', AnimeApi.search);
router.get('/category', AnimeApi.category);
router.get('/genre/:genre',AnimeApi.genre);
router.get('/genre/:genre/page/:page',AnimeApi.genre);

module.exports = router;