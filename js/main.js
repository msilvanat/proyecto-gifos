document.addEventListener('DOMContentLoaded', () => {
    //Variables
    let logo = document.getElementById('logo')
    let botonCrearGuif = document.getElementById('btn_create_gif')
    let botonDropDown = document.getElementById('btn-select')
    let icon = document.getElementById('icon')
        //Theme
    let tema = document.getElementById('theme')
    let changeTema = localStorage.getItem('tema')
    let active = false
    let theme1 = document.getElementById('theme1')
    let theme2 = document.getElementById('theme2')
        //Search button
    let inputSearch = document.getElementById('buscador')
    let listaSugerencias = document.getElementById('busqueda_sugerida')
    let searchButton = document.getElementById('btn-buscar')
    let historialBusquedas = document.getElementById('content_busquedas')
    let imgBuscar = document.getElementsByClassName('img_buscar')
        //Suggestions
    let primerSugerencia = document.getElementById('sugerencia1')
    let segundaSugerencia = document.getElementById('sugerencia2')
    let tercerSugerencia = document.getElementById('sugerencia3')
        //My Gifos
    let misGifs = document.getElementById('mis_gifos')
        //Suggested
    let guifSugeridos = document.getElementById('guif-sugeridos')
    let inputSugerencias = document.getElementById('sugeridos')
    let imgSugeridos = document.getElementsByClassName('img_sugeridos')
        //Trending
    let trendingGuif = document.getElementById('trending')
    let trendingNode = document.getElementById('content-tendencias')
    let imgTendencias = document.getElementsByClassName('img_tendencias')

    let search = null

    //Api
    const apiKey = 'IlTug0rvBgmJXc07RvNU7D47sks6pUcR'
    const defaultUrl = 'https://api.giphy.com/v1/gifs'
    const searchUrl = `${defaultUrl}/search?q=`
    const trendingUrl = `${defaultUrl}/trending`

    class GuifOS {
        constructor(image, title, height, width) {
            this.image = image
            this.title = title
            this.height = height
            this.width = width
        }
    }

    //Functions

    const loadTheme = () => {
        if (changeTema === "false") {
            console.log('tema2')
            tema.setAttribute('href', './css/sailor_night.css')
            icon.setAttribute('href', './assets/logo/logo-icon/gifOF_logo_dark.ico')
        } else {
            console.log('tema1');
            tema.setAttribute('href', './css/style.css')
            icon.setAttribute('href', './assets/logo/logo-icon/gifOF_logo.ico')
        }
    }
    loadTheme()

    const getSearchByName = () => search = inputSearch.value

    const getSearchSugerencias = str => {
        inputSearch.value = str
        getSearchByName()
        getSearchResults(search)
    }

    const mostrarMenu = () => {
        document.getElementById('dropdown').classList.toggle('active');
    }

    const tendencias = ((cant, cat) =>
        fetch(`${trendingUrl}?api_key=${apiKey}&limit=${cant}&rating=${cat}`)
    )

    //Function remove item from array
    const removeItemFromArr = (arr, item) => {
        let i = arr.indexOf(item)
        i !== -1 && arr.splice(i, 1)
    }

    const dividirTexto = (e, item) => e.split(" ", item)

    //Search history
    const getSearchHistorial = () => {
        let template = `
            <div class="enlace_busquedas">
                <a class="historial_link" href="#">#${search}</a>
            </div>
        `
        historialBusquedas.insertAdjacentHTML('afterbegin', template)
    }

    //Click url image
    const goTogif = clas => {
        for (let i of clas) {
            i.addEventListener('click', () => {
                window.open(i.src, "gif")
            })
        }
    }

    const mostrarGuifBuscados = data => {
        console.log("Mostrar data: ", data);
        let template = ''
        data.map((element, index) => {
            if ((index + 1) % 5 === 0) {
                template += `
                    <div class="content-gifFound-large">
                        <div class="loader">
                            <div class="spinner">Loading...</div>
                        </div>
                        <img class="img_buscar" src="${element.image}">
                    </div>                
                `
            } else {
                template += `
                    <div class="content-foundGif">
                        <div class="loader">
                            <div class="spinner">Loading...</div>
                        </div>
                        <img class="img_buscar" src="${element.image}">
                    </div>
                `
            }
        })
        guifSugeridos.innerHTML = template
    }

    //const mostrarGuifBuscados = data => {
    //let template = ''
    // for (let e of data) {
    //     if (e.height >= 300) {
    //         template += `
    //             <div class="content-foundGif">
    //                 <div class="loader">
    //                     <div class="spinner">Loading...</div>
    //                 </div>
    //                 <img class="img_buscar" src="${e.image}">
    //             </div>
    //         `
    //     } else {
    //         template += `
    //             <div class="content-gifFound-large">
    //                 <div class="loader">
    //                     <div class="spinner">Loading...</div>
    //                 </div>
    //                 <img class="img_buscar" src="${e.image}">
    //             </div>                
    //         `
    //     }
    // }

    const getGifById = id => {
        const urlById = `${defaultUrl}/${id}?api_key=${apiKey}`
        fetch(urlById)
            .then(res => res.json())
            .then(res => {
                res.data
                const template = `
                <div class="mis_guifos">
                    <div class="loader">
                        <div class="spinner">Loading...</div>
                    </div>
                    <img src="${res.data.images.fixed_height.url}">
                </div>
            `
                let seccionMisGifos = document.getElementById('content_mis_gifos')
                seccionMisGifos.insertAdjacentHTML("afterbegin", template)
            })
    }

    const getGifsById = gifsId => {
        for (let id of gifsId) {
            getGifById(id)
        }
    }

    const validarGifsId = () => {
        if (localStorage.getItem('myGifs') !== null) {
            let gifsId = JSON.parse(localStorage.myGifs);
            if (gifsId.length === 0) {
                console.log('no hay gifos creados')
            } else {
                console.log('hay gifos')
                getGifsById(gifsId)
            }
        }
    }

    //Search gif
    const getSearchResults = search => {
        search = inputSearch.value
        fetch(`${searchUrl}${search}&api_key=${apiKey}&limit=10`)
            .then(res => res.json())
            .then(data => {
                let guifs = []
                for (let e of data.data) {
                    guifs.push(new GuifOS(
                        e.images.fixed_height.url,
                        e.title,
                        e.images.fixed_height.height,
                        e.images.fixed_height.width
                    ))
                }
                //console.log(guifs)
                inputSugerencias.value = search + " [resultados]"
                mostrarGuifBuscados(guifs)
                trendingNode.style.display = "none"
                listaSugerencias.style.visibility = "hidden"
                getSearchHistorial()
                goTogif(imgBuscar)
                return data
            })
            .catch(error => {
                return error
            })
    }


    //Suggested  
    // Bring 4 gifs from trending endpoint    
    tendencias(4, 'pg')
        .then(res => res.json())
        .then(data => {
            for (let e of data.data) {
                let textoDividido = dividirTexto(e.title, 3)
                removeItemFromArr(textoDividido, 'GIF');
                let newText = textoDividido.join(" ")
                const template = `
                    <div class="guif_sugeridos">
                            <div class="titulo">
                                <p>#${newText}</p>
                                <span><img src="../../../../assets/icons/close.svg" alt=""></span>
                            </div>
                            <div class="guifs">
                                <div class="loader">
                                    <div class="spinner">Loading...</div>
                                </div>
                                <img class="img_sugeridos" src="${e.images.fixed_height.url}">
                                <button class='btn-verGif' id="btn-verGif">Ver Más</button>
                            </div>
                        </div>
                    `
                guifSugeridos.insertAdjacentHTML('beforeEnd', template)
            }
            goTogif(imgSugeridos)
        })
        .catch(error => console.log(error))


    //Trending endpoint    
    tendencias(20, 'g')
        .then(res => res.json())
        .then(data => {
            for (let e of data.data) {
                let textoDividido = dividirTexto(e.title, 3)
                removeItemFromArr(textoDividido, 'GIF');
                let newText = textoDividido.join(" #")

                if (e.images.fixed_height.height >= 200) {
                    const template = `
                              <div class="content-giftrending">
                                  <div class="loader">
                                      <div class="spinner">Loading...</div>
                                  </div>
                                  <img class="img_tendencias" src="${e.images.fixed_height.url}">
                                  <p>#${newText}</p>
                              </div>
                          `
                    trendingGuif.insertAdjacentHTML('beforeEnd', template)
                } else {
                    const template = `
                              <div class="content-giftrending-large">
                                  <div class="loader">
                                      <div class="spinner">Loading...</div>
                                  </div>
                                  <img class="img_tendencias" src="${e.images.fixed_height.url}">
                                  <p>#${newText}</p>
                              </div>
                          `
                    trendingGuif.insertAdjacentHTML('beforeEnd', template)
                }
                goTogif(imgTendencias)
            }
        })
        .catch(error => console.log(error))

    //EVENTS

    //Logo
    logo.addEventListener('mousemove', () => {
        logo.style.cursor = "pointer"
    })
    logo.addEventListener('click', () => {
        location.href = 'index.html'
    })

    //Create GuifOS
    botonCrearGuif.addEventListener('click', () => {
        location.href = 'crear_guif.html'
    })

    // Change theme
    botonDropDown.addEventListener('click', mostrarMenu);

    //Theme 1
    theme1.addEventListener('click', () => {
            tema.setAttribute('href', './css/style.css')
            icon.setAttribute('href', './assets/logo/logo-icon/gifOF_logo.ico')
            mostrarMenu()
            active = true
            localStorage.setItem('tema', active)
        })
        //Theme 2  
    theme2.addEventListener('click', () => {
        tema.setAttribute('href', './css/sailor_night.css')
        icon.setAttribute('href', './assets/logo/logo-icon/gifOF_logo_dark.ico')
        mostrarMenu()
        active = false
        localStorage.setItem('tema', active)
    })

    misGifs.addEventListener('click', () => {
        console.log('click')
        let seccionBuscar = document.getElementById('content-buscar')
        seccionBuscar.style.display = "none"
        inputSugerencias.value = "Mis Gifos"
        trendingNode.style.display = "none"
        listaSugerencias.style.visibility = "hidden"
        guifSugeridos.style.display = "none"
        historialBusquedas.style.display = "none"
        validarGifsId()
    })

    //Searcher                             
    inputSearch.addEventListener("keyup", (event) => {
        if (inputSearch.value === "" || event.code == "Space") {
            listaSugerencias.style.visibility = "hidden"
            searchButton.className = 'btn_basic btn_inactive'
            searchButton.disabled = true;
        } else {
            listaSugerencias.style.visibility = "visible"
            searchButton.className = 'btn_basic btn_active'
            searchButton.disabled = !searchButton.disabled
            getSearchByName()
            primerSugerencia.innerText = search
        }
    })


    searchButton.addEventListener('click', getSearchResults)

    primerSugerencia.addEventListener('click', getSearchResults)

    segundaSugerencia.addEventListener('click', () => {
        getSearchSugerencias('deportes')
    })

    tercerSugerencia.addEventListener('click', () => {
        getSearchSugerencias('animales')
    })

    // CLICK ENTER
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            getSearchResults()

        }
    })


})