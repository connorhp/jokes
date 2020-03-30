let app = new Vue({
    el: '#app',
    data: {
        numJokes: 0,
        jokes: [],
        numColumns: 3,
        maxJokes: 10,
        numJokesHave: 0,
    },
    watch: {
        numJokes(newValue, oldValue) {
            if (newValue == '') {
                this.numJokes = '';
            }
            else if (newValue >= 10) {
                this.numJokes = 10;
            }
            else if (newValue < 0) {
                this.numJokes = 0;
            }
            else {
                this.numJokes = newValue;
            }
            if (this.numJokes != '') {
                if (this.numJokesHave < this.numJokes) {
                    this.addJokes();
                }
                else if (this.numJokesHave > this.numJokes) {
                    this.deleteJokes();
                }
            }
        }
    },
    methods: {
        async getJoke(row, col) {
            console.log("row = " + row + " col = " + col);
            console.log(this.jokes[row][col]);
            try {
                const response = await axios.get('https://icanhazdadjoke.com/', {
                    "headers": {
                        'Accept': 'application/json'
                    }
                });

                this.jokes[row][col].id = response.data.id;
                this.jokes[row][col].joke = response.data.joke;
                this.jokes[row][col].status = response.data.status;
                console.log(this.jokes[row][col])
            }
            catch (error) {
                console.log(error);
            }
        },
        addJokes() {
            let numAdded = 0;
            let numToAdd = this.numJokes - this.numJokesHave;
            let maxRows = Math.ceil(this.maxJokes / this.numColumns);
            let whichRow = Math.floor(this.numJokesHave / this.numColumns);
            for (let i = whichRow; i < maxRows; ++i) {
                console.log(this.jokes[i])
                if (this.jokes[i] == undefined) this.jokes.push([]);
                for (let j = this.jokes[i].length; j < this.numColumns; ++j) {
                    this.jokes[i].push({
                        id: '',
                        joke: "Press the button to generate a joke",
                        status: 0
                    });
                    numAdded++;
                    this.numJokesHave++;
                    if (numAdded == numToAdd) return;
                }
            }
        },
        deleteJokes() {
            let numDeleted = 0;
            let numToDelete = this.numJokesHave - this.numJokes;
            for (let i = this.jokes.length - 1; i >= 0; --i) {
                for (let j = this.jokes[i].length - 1; j >= 0; --j) {
                    this.jokes[i].pop();
                    numDeleted++;
                    this.numJokesHave--;
                    if (numDeleted == numToDelete) return;
                }
            }
        }
    }
})
