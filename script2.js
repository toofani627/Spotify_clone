let previous_selected = null;
// let previousSelected = null; // Track the previously clicked song


Array.from(document.querySelector('.songs_list').getElementsByTagName('li')).forEach(e => {
    e.addEventListener('click', () => {
        // console.log(e.querySelector('.info').firstElementChild.innerHTML);
        // PlayMusic(e.querySelector('.info').firstElementChild.innerHTML);

        // Remove highlight from the previously selected song
        if (previousSelected) {
            previousSelected.classList.remove('highlighted'); // Remove class from the previous song
        }

        // Add highlight to the new clicked song
        e.classList.add('highlighted');

        // Update the reference
        previousSelected = e;
    });
});

