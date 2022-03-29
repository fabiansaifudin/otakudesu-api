const scraperjs = require('scraperjs');

class AnimeApi {
    home({ params: { page } },req) {
        scraperjs.StaticScraper.create(`https://otakudesu.live/`)
            .scrape(async ($) => {
                const obj = {}
                obj.OnGoing = $(".venutama div.rseries div.rapi div.venz ul li")
                    .map(function() {
                        return {
                            title: $(this).find('a h2').text(),
                            episode: parseInt($(this).find('div.epz')
                                .text()
                                .replace(' Episode ', '')),
                            release_time: $(this).find('div.newnime').text(),
                            link: $(this).find('a').attr('href'),
                            linkId: $(this)
                                .find('a')
                                .attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', ''),
                            image: $(this)
                                .find('div.thumb div.thumbz img')
                                .attr('src')
                            // status: $(this).find('span:nth-child(4)').text().replace( /\s/g, '').split(":")[1]
                        }
                    })
                    .get()
                    .slice(0, 5)
                    await Promise.all(
                        obj.OnGoing.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.rating = parseFloat($('#venkonten div.venser div.fotoanime div.infozin div.infozingle')
                                    .map(function() {
                                        return $(this).find('p:nth-child(3)')
                                            .text()
                                            .replace( /\s/g, '')
                                            .split(":")[1]
                                    }).get()[0])
                                e.genre = $('#venkonten div.venser div.fotoanime div.infozin div.infozingle p:last-child a')
                                    .map(function() {
                                        return $(this).text()
                                    }).get()
                                e.sinopsis = $('#venkonten div.venser div.fotoanime div.sinopc p')
                                    .map(function(){
                                        return $(this).text()
                                    }).get()
                                return e
                            })
                            return true
                        })
                    )
                obj.Complete =  $(".venutama div.rseries div.rseries div.rapi div.venz ul li")
                    .map(function(){
                        return {
                            title: $(this).find('a h2').text(),
                            episode: parseInt($(this).find('div.epz')
                                .text()
                                .replace(' Episode', '')),
                            release_time: $(this).find('div.newnime').text(),
                            link: $(this).find('a').attr('href'),
                            linkId: $(this)
                                .find('a')
                                .attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', ''),
                            image: $(this)
                                .find('div.thumb div.thumbz img')
                                .attr('src')
                        }
                    }).get()
                req.send(obj)
            },
        )
    }

    showOngoing({ params: { page } }, req) {
        page = typeof page === 'undefined' ? '' : page === '1' ? '' : `page/${page.toString()}/`
        scraperjs.StaticScraper.create(`https://otakudesu.live/ongoing-anime/${page}`)
            .scrape(async ($) => {
                const obj = $(".venutama div.rseries div.rapi div.venz ul li")
                .map(function() {
                    return {
                        title: $(this).find('a h2').text(),
                        episode: parseInt($(this).find('div.epz')
                            .text()
                            .replace(' Episode ', '')),
                        release_time: $(this).find('div.newnime').text(),
                        link: $(this).find('a').attr('href'),
                        linkId: $(this)
                            .find('a')
                            .attr('href')
                            .replace('https://otakudesu.live/anime/', '')
                            .replace('/', ''),
                        image: $(this)
                            .find('div.thumb div.thumbz img')
                            .attr('src')
                        // status: $(this).find('span:nth-child(4)').text().replace( /\s/g, '').split(":")[1]
                    }
                }).get()
                req.send(obj)
            })
    }

    showFinish({ params: { page } }, req) {
        page = typeof page === 'undefined' ? '' : page === '1' ? '' : `page/${page.toString()}/`
        scraperjs.StaticScraper.create(`https://otakudesu.live/complete-anime/${page}`)
            .scrape(async ($) => {
                const obj = $(".venutama div.rseries div.rapi div.venz ul li")
                .map(function() {
                    return {
                        title: $(this).find('a h2').text(),
                        episode: parseInt($(this).find('div.epz')
                            .text()
                            .replace(' Episode ', '')),
                        release_time: $(this).find('div.newnime').text(),
                        link: $(this).find('a').attr('href'),
                        linkId: $(this)
                            .find('a')
                            .attr('href')
                            .replace('https://otakudesu.live/anime/', '')
                            .replace('/', ''),
                        image: $(this)
                            .find('div.thumb div.thumbz img')
                            .attr('src')
                        // status: $(this).find('span:nth-child(4)').text().replace( /\s/g, '').split(":")[1]
                    }
                }).get()
                req.send(obj)
            })
    }

    showAnime({ params: { id } }, req) {
        const page = `https://otakudesu.live/anime/${id}`
        scraperjs.StaticScraper.create(page)
            .scrape(async ($) => {
                const data = {}
                const info = $('#venkonten div.venser div.fotoanime div.infozin div.infozingle p')
                    .map(function() {
                        return $(this).text().split(': ')[1]
                    }).get()
                const img = $('#venkonten div.venser div.fotoanime img')
                const desc = $('#venkonten div.venser div.fotoanime div.sinopc p')
                    .map(function() {
                        return $(this).text()
                    }).get()
                data.title = info[0]
                data.japanese = info[1]
                data.rating = parseFloat(info[2])
                data.produser = info[3]
                data.type = info[4]
                data.status = info[5]
                data.total_eps = info[6]
                data.durasi = info[7]
                data.tgl_rilis = info[8]
                data.studio = info[9]
                data.genre = info[10].split(', ')
                data.image = img.attr('src')
                data.description = desc
                data.episode = $('#venkonten div.venser div.episodelist:nth-child(8) ul li')
                    .map(function() {
                        return {
                            title: $(this)
                                .find('span a')
                                .text(),
                            link: $(this)
                                .find('span a')
                                .attr('href'),
                            linkId: $(this)
                                .find('span a')
                                .attr('href')
                                .replace('https://otakudesu.live/', '')
                                .replace('/', '')
                        }
                    }).get()
                req.send(data)
            })
    }
    
    animeEps({ params: { id } }, req) {
        const page = `https://otakudesu.live/${id}`
        scraperjs.StaticScraper.create(page)
            .scrape(async ($) => {
                const data = {}
                data.frame = $('#venkonten div.venser div.venutama div#lightsVideo')
                    .map(function() {
                        return {
                                src: $(this)
                                    .find('iframe')
                                    .attr('src'),
                            }
                    }).get()
                    await Promise.all(
                        data.frame.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.src).scrape(($) => {
                                e.video = $('#mediaplayer source').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                req.send(data)
            })
    }
    
    search({ params: { title } }, req) {
        const page = `https://otakudesu.live/?s=${title}&post_type=anime`
        scraperjs.StaticScraper.create(page)
            .scrape(async ($) => {
                const obj = $('#venkonten div.page ul.chivsrc li')
                    .map(function() {
                        return {
                            title: $(this).find('h2 a').text(),
                            image: $(this).find('img').attr('src'),
                            genre: $(this).find('.set:nth-child(3)')
                                .text()
                                .replace('Genres : ', '')
                                .split(', '),
                            status: $(this).find('.set:nth-child(4)')
                                .text()
                                .replace('Status : ', ''),
                            rating: parseFloat($(this).find('.set:nth-child(5)')
                                .text()
                                .replace('Rating : ', '')),
                            link: $(this).find('h2 a').attr('href'),
                            linkId: $(this).find('h2 a')
                                .attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                req.send(obj)
            })
    }

    category({ params: {  } }, req) {
        const page = `https://otakudesu.live/anime-list/`
        scraperjs.StaticScraper.create(page)
            .scrape(async ($) => {
                const data = {}
                data.nmrone = $('#venkonten div.daftarkartun div#abtext div.bariskelom:first-child div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.nmrone.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.nmrtwo = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(2) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.nmrtwo.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.nmrthree = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(3) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.nmrthree.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.nmreight = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(4) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.nmreight.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.nmrnine = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(5) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.nmrnine.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.A = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(6) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.A.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.B = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(7) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.B.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.C = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(8) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.C.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.D = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(9) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.D.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.E = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(10) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.E.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.F = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(11) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.F.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.G = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(12) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.G.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.H = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(13) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.H.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.I = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(14) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.I.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.J = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(15) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.J.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.K = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(16) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.K.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.L = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(17) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.L.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.M = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(18) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.M.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.N = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(19) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.N.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.O = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(20) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.O.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.P = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(21) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.P.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.Q = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(22) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.Q.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.R = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(23) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.R.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.S = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(24) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.S.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.T = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(25) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.T.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.U = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(26) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.U.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.V = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(27) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.V.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.W = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(28) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.W.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.Y = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(29) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.Y.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                data.Z = $('#venkonten div.daftarkartun div#abtext div.bariskelom:nth-child(30) div.penzbar div.jdlbar')
                    .map(function() {
                        return {
                            title: $(this).find('ul li a').text(),
                            link: $(this).find('ul li a').attr('href'),
                            linkId: $(this).find('ul li a').attr('href')
                                .replace('https://otakudesu.live/anime/', '')
                                .replace('/', '')
                        }
                    }).get()
                    await Promise.all(
                        data.Z.map(async (e) => {
                            await scraperjs.StaticScraper.create(e.link).scrape(($) => {
                                e.image = $('#venkonten div.venser div.fotoanime img').attr('src')
                                return e
                            })
                            return true
                        })
                    )
                req.send(data)
            })
    }

    genre({ params: { genre, page } }, req) {
        page = typeof page === 'undefined' ? '' : page === '1' ? '' : `page/${page.toString()}/`
        scraperjs.StaticScraper.create(`https://otakudesu.live/genres/${genre}/${page}`)
            .scrape(async ($) => {
                const data = $('#venkonten div.vezone div.venser div.page div.col-anime-con')
                    .map(function() {
                        return {
                            title: $(this)
                                .find('.col-anime .col-anime-title a')
                                .text(),
                            studio: $(this)
                                .find('.col-anime .col-anime-studio')
                                .text(),
                            episode: $(this)
                                .find('.col-anime .col-anime-eps')
                                .text(),
                            rating: parseFloat($(this)
                                .find('.col-anime .col-anime-rating')
                                .text()),
                            genre: $(this)
                                .find('.col-anime .col-anime-genre')
                                .text()
                                .split(', '),
                            cover: $(this)
                                .find('.col-anime .col-anime-cover img')
                                .attr('src'),
                            desc: $(this)
                                .find('.col-anime .col-synopsis')
                                .text(),
                            date: $(this)
                                .find('.col-anime .col-anime-date')
                                .text()
                        }
                    }).get()
                req.send(data)
            })
    }
}

module.exports = new AnimeApi