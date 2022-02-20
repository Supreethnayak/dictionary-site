let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = ''
let notFound = document.querySelector('.not__found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');

searchBtn.addEventListener('click', function(e){
    e.preventDefault(); //no page refresh

    // clear old data
    notFound.innerText = ''
    defBox.innerHTML = ''
    audioBox.innerHTML = ''

    // Get input data
    let word = input.value;

    // call API get data
    if (word === '') {
        alert('Word is required')
        return
    }

    getData(word)
})

// asynchronous function
async function getData(word){
    loading.style.display = 'block';
    // Ajax call
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`)
    const data = await response.json()

    // if empty result
    if (!data.length) { // if arry is empty
        loading.style.display = 'none'; // dont show

        notFound.innerText = 'No result found!'
        return
    }

    // if result is sugessions
    if (typeof data[0] === 'string') { // if fist item is string then it is sugesstion, else array(coorect result)
        loading.style.display = 'none'; // dont show

        let heading = document.createElement('h3')
        heading.innerText = 'Did you mean?'
        notFound.appendChild(heading)

        data.forEach(element => {
            let suggetion = document.createElement('span')
            suggetion.classList.add('suggested')
            suggetion.innerText = element

            notFound.appendChild(suggetion) // add all sugessions one by one and display in noFound
        })
        return
    }


    // Result found
    loading.style.display = 'none'; // dont show

    let definition = data[0].shortdef[0]
    defBox.innerText = definition


    // Sound
    const soundName = data[0].hwi.prs[0].sound.audio
    if (soundName) {
        // if the sound file is awailable
        renderSound(soundName)
    }


    console.log(data);
}

function renderSound(soundName){
    let subfolder = soundName.charAt(0)
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?${apiKey}`
    // audioBox.innerText = soundSrc

    let aud = document.createElement('audio')
    aud.src = soundSrc
    aud.controls = true
    audioBox.appendChild(aud)
}