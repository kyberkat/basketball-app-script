const { default: axios } = require('axios')
const { placeholder } = require('./data')

require('dotenv').config()

const API_URL = process.env.API_URL || null
const API_TOKEN = process.env.API_TOKEN || null

const playersEndpoint = API_URL.concat('players')
const gamesEndpoint = API_URL.concat('games')

const getPlayers = async () => {
    const reply = await axios.get(playersEndpoint, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })

    const playerCollection = reply.data.data
    for (const player of playerCollection) {
        console.log(player.primaryKey + " " + player.name)
    }
}

const getGames = async () => {
    const reply = await axios.get(gamesEndpoint, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })

    const gameCollection = reply.data.data
    for (const game of gameCollection) {
        console.log(game.primaryKey + " " + game.vs)
    }
}

const createGames = async () => {
    const collection = placeholder.games

    for (const game of collection) {
        const reply = await axios.post(gamesEndpoint, { data: game },
            {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            })

        const collection = reply.data.data
        console.log(`created game ${collection.vs}`)
    }
}

const createPlayers = async () => {
    const collection = placeholder.players

    for (const player of collection) {
        const reply = await axios.post(playersEndpoint, { data: player },
            {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            })

        const collection = reply.data.data
        console.log(`created player ${collection.name}`)
    }
}

const cleanUp = async () => {
    const reply = await axios.get(playersEndpoint, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })

    const playerCollection = reply.data.data

    console.log(playerCollection)

    for (const player of playerCollection) {

        const playerEndpoint = playersEndpoint.concat(`/${player.documentId}`)

        console.log(playerEndpoint)

        const reply = await axios.delete(playerEndpoint, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })

        console.log("deleted", reply.data)
    }
}

const cleanUpGames = async () => {
    const reply = await axios.get(gamesEndpoint, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })

    const gameCollection = reply.data.data

    console.log(gameCollection)

    for (const game of gameCollection) {

        const gameEndpoint = gamesEndpoint.concat(`/${game.documentId}`)

        console.log(gameEndpoint)

        const reply = await axios.delete(gameEndpoint, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })

        console.log("deleted", reply.data)
    }
}

// const fetchOne = async () => {
//     const reply = await axios.get(`${playersEndpoint}/x63fy0p73loflr9cg679f9zc`, {
//             headers: {
//                 'Authorization': `Bearer ${API_TOKEN}`,
//                 'Content-Type': 'application/json'
//             }
//     })

//     console.log(reply.data.data)

// }

const script = async () => {
    if (!API_TOKEN || !API_URL) {
        console.log("no environments provided")
        process.exit(1)
    }

    const flagActions = {
        '-get -players': getPlayers,
        '-create -players': createPlayers,
        '-delete -players': cleanUp,
        '-get -games': getGames,
        '-create -games': createGames,
        '-delete -games': cleanUpGames
    }


    const flagWatch = ['-get -players', '-post -players', '-delete -players', '-get -games', '-create -games', '-delete -games'];

    const args = process.argv.slice(2).join(' ');

    try {
        for (const flag of flagWatch) {
            if (args.includes(flag)) {
                // Call the corresponding action based on the flag
                const func = flagActions[flag];
                if (func) {
                    console.log(`Calling function for flag: ${flag}`);
                    await func();
                } else {
                    console.log(`No function found for flag: ${flag}`);
                }
            }
        }

    } catch (e) {
        console.error("error with axios", e)
    }
}

script()