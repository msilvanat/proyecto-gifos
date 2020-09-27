document.addEventListener('DOMContentLoaded', () => {
    //Variables
    let volver = document.getElementById('volver')
    let logoClaro = document.getElementById('logo_claro')
    let logoDark = document.getElementById('logo_dark')
    let changeTema = localStorage.getItem('tema')
    let tema= document.getElementById('theme')
    let icon = document.getElementById('icon')
    //Create Gif
    let ventanaCrearGif = document.getElementById('content_crear_guif')
    let botonCancelar = document.getElementById('btn-cancelar')
    let botonComenzar = document.getElementById('btn-comenzar')
    //Record Gif
    let video = document.getElementById('video')
    let contenedorCrearGif = document.getElementById('content_crear_guif')
    let contenedorVideo = document.getElementById('content_video')
    let botonClose = document.getElementById('close')
    let contendorGifoUpLoad = document.getElementById('content_gifo_upload')
    let botonCapturar = document.getElementById('btn-capturar')
    let seccionCaptura = document.getElementById('capturar')
    let seccionRecording = document.getElementById('recording')
    let botonListo = document.getElementById('btn_listo')
    let botonesSecundarios = document.getElementById('secondary_buttons')
    let textoVentana = document.getElementById('content_video_text')
    let botonRepetirCaptura = document.getElementById('btn_repetir_captura')
    let botonSubirGif = document.getElementById('btn_subir_gifo')
    let botonCancelLoad = document.getElementById('btn_cancel_load')
    let infoLoad = document.getElementById('content_info_load') 
    let timer = document.getElementById('timer')
    let previewGif = document.getElementById('gif_preview')
    //Upload Gif
    let botonCloseGifUpload = document.getElementById('close_gifo_upload')
    let botonCopiarUrl = document.getElementById('btn_copy_url_gifo')
    let botonDownloadGifo = document.getElementById('btn_download_gifo')
    let botonFinUpload = document.getElementById('btn_listo_upload')
    let showMinPreview = document.getElementById('preview_gif_min')
    //My Gifos
    let gifsCreados = document.getElementById('gif-creados') 

    //Api
    const urlUpload = 'http://upload.giphy.com/v1/gifs'
    const apiKey = 'IlTug0rvBgmJXc07RvNU7D47sks6pUcR'
    const defaultUrl = 'http://api.giphy.com/v1/gifs'

    let recorder = null
    let blob = null

    let timerGif = null
    let h = 0
    let m = 0
    let s = 0
    let ms = 0

    const configVideo = 
            {
                video: {
                    height: { max: 470 }
                    },
                audio: false
            }

    //Functions      
    //Load theme
    const loadTheme = () =>{
        console.log(changeTema)
        if(changeTema === "false"){
            console.log('tema2')
            tema.setAttribute('href', './css/sailor_night.css')
            ventanaCrearGif.classList.toggle('dark')
            contenedorVideo.classList.toggle('dark')
            contendorGifoUpLoad.classList.toggle('dark')
            icon.setAttribute('href', './assets/logo/logo-icon/gifOF_logo_dark.ico')        
        }else{
            console.log('tema1');
            tema.setAttribute('href', './css/style.css')
            icon.setAttribute('href', './assets/logo/logo-icon/gifOF_logo.ico')        
        } 
    }
    loadTheme()

    const getUrlSecondaryMyWeb = () => location.href = 'crear_guif.html'

    //Timer
    const tiempoVideo = () => {
        timerGif = setInterval( () => {
            let hours = h < 10 ? '0' + h : h
            let min = m < 10 ? '0' + m : m
            let sec = s < 10 ? '0' + s : s
            let miliSec = ms < 10 ? '0' + ms : ms

            if(ms < 9) { ms += 1 }
            else if(s < 59) { ms = 0; s += 1 } 
            else if(m < 59) { ms = 0; s = 0; m += 1 }
            else if(h < 23) { ms = 0; s = 0; m = 0; h +=1 }
            
            timer.innerHTML = hours + ':' + min + ':' + sec + ':' + miliSec
        }, 100)
    }

    const stopTimer = () => clearInterval(timerGif)

    //Preloader
    const preloader = id => { 
        let element = document.getElementById(id);    
        let width = 1; 
        const loadinTime = setInterval(() => {
            if (width >= 99) { 
                clearInterval(loadinTime);
                contendorGifoUpLoad.style.display = 'flex'
                contenedorVideo.style.display = 'none'
                playPreview(blob, showMinPreview) 
                }else{ 
                    width++;  
                    element.style.width = width + '%';  
                }
        }, 100); 
    }

    //Camera functions
    const getMedia = () => navigator.mediaDevices.getUserMedia(configVideo)        

    const videoPlay = stream => {
        video.srcObject = stream
        video.play()
        return stream
    }

    const getStreamAndRecord = () => {
        getMedia()
        .then(stream => {
            videoPlay(stream)        
        })   
        .catch(err => {
            console.log(err)
        });
    }

    const grabarGif = () => {
        getMedia()
        .then( stream => {
            recorder = RecordRTC(stream, {
                type: 'gif',
                frameRate: 1,
                quality: 10,
                width: 360,
                hidden: 240,
                onGifRecordingStarted: () => {
                console.log('started')
                },
            })
            recorder.startRecording()
        })
    }

    const playPreview = (blob, id) => {
        let previews = URL.createObjectURL(blob)     
        id.src = previews
    }

    const stopGif = recorder => {
        recorder.stopRecording( () => {
        blob = recorder.getBlob()
        console.log(blob)
        })
        video.style.display = 'none'
        previewGif.style.display = 'block'
        playPreview(blob, previewGif)
    } 

    const createDataForApi = blob => { 
        form = new FormData();
        form.append('file', blob, 'myGif.gif');
        const configUpload = {method: 'POST', mode: 'cors', body: form}
        const ApiUpload = fetch(`${urlUpload}?api_key=${apiKey}`, configUpload)
        ApiUpload
        .then(res => res.json())
        .then(res => {
            saveGifLocalStorage(res.data.id)
        })
        .catch(err => console.log(err))
    }

    //Save Gifos in localStorage
    const saveGifLocalStorage = gifId => {
        const actualGifs = JSON.parse(localStorage.getItem('myGifs')) || []
        const newGifs = [...actualGifs, gifId]
        localStorage.setItem('myGifs', JSON.stringify(newGifs))
    }

    const downLoadGifo = blob => {
        invokeSaveAsDialog(blob, 'fileName')
    } 

    const copyUrl = () => {
        let copy = document.createElement("input")
        copy.setAttribute("value", showMinPreview.src)
        document.body.appendChild(copy)
        copy.select()
        document.execCommand("copy")
        document.body.removeChild(copy)
    }

    const getGifById = id => {
        const urlById = `${defaultUrl}/${id}?api_key=${apiKey}`
        fetch(urlById)
        .then( res => res.json())
        .then( res => {
            res.data
            const template = `
                    <div class="mis_guifos">
                        <div class="loader">
                            <div class="spinner">Loading...</div>
                        </div>
                        <img src="${res.data.images.downsized_large.url}">
                    </div>
            ` 
            gifsCreados.insertAdjacentHTML('afterbegin', template)
        })
    }

    const getGifsById = gifsId => {   
        for(let id of gifsId){
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
    validarGifsId()

    //EVENTS
    volver.addEventListener('click',()=>{
        location.href = 'index.html'
    })
    //Logo
    logoClaro.addEventListener('mousemove', () => {
        logoClaro.style.cursor = "pointer"
    })

    logoClaro.addEventListener('click', () => {
        getUrlSecondaryMyWeb()
    })

    logoDark.addEventListener('mousemove', () => {
        logoDark.style.cursor = "pointer"
    })

    logoDark.addEventListener('click', () => {
        getUrlSecondaryMyWeb()
    })
    //Create Gif
    botonComenzar.addEventListener('click', () => {
        contenedorCrearGif.style.display = 'none'
        contenedorVideo.style.display = 'block'
        getStreamAndRecord()
    })

    botonCancelar.addEventListener('click', () => {
        location.href = 'index.html'
    })
    //Record Gif
    botonClose.addEventListener('click', () => {
        getUrlSecondaryMyWeb()
    })

    botonCapturar.addEventListener('click', () => {
        seccionCaptura.style.display = 'none'
        seccionRecording.style.display = 'flex'
        timer.style.display = 'flex'
        textoVentana.innerText = `Capturando Tu Guifo`
        grabarGif()
        tiempoVideo()
    })

    botonListo.addEventListener('click', () => {
        stopGif(recorder)
        stopTimer()
    })

    seccionRecording.addEventListener('click', () => {
        seccionRecording.style.display = 'none'
        botonesSecundarios.style.display = 'flex'
    })

    botonSubirGif.addEventListener('click', () => {
        textoVentana.innerText = `Subiendo Guifo`
        previewGif.style.display = 'none'
        video.style.display = 'block'
        video.srcObject = null
        infoLoad.style.display = 'flex'
        preloader('progress_bar_upload')
        botonesSecundarios.style.display = 'none'
        botonCancelLoad.style.display = 'inline'
        createDataForApi(blob)
    })

    botonRepetirCaptura.addEventListener('click', (event) => {
        event.preventDefault()
        getUrlSecondaryMyWeb()
    })

    botonCancelLoad.addEventListener('click' , () => {
        getUrlSecondaryMyWeb()
    })

    botonCloseGifUpload.addEventListener('click', () => {
        getUrlSecondaryMyWeb()
    })

    botonCopiarUrl.addEventListener('click', () => {
        copyUrl()
        console.log('copy')
    })

    botonDownloadGifo.addEventListener('click', () => {
        console.log('click')
        downLoadGifo(blob)
        console.log(blob)
    })

    botonFinUpload.addEventListener('click', () => {
        getUrlSecondaryMyWeb()
    })
})
