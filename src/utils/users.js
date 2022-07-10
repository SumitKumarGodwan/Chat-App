const users = []

// adduser, removeuser, getuser, getuserinroom

const adduser = ({id, username, room}) => {
    // clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // If the data is invalid
    if (!username || !room) {
        return {
            error:"Username or room are required"
        }
    }

    // Check for existing user

    const existinguser = users.find((user) => {
        return username.room === room && user.username === username
    })

    if (existinguser) {
        return {
            error:"Username is in use!"
        }
    }

    //  Store user
    const user = {id, username, room}
    users.push(user)

    return {user}
}


const removeuser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index!=-1) {
        return users.splice(index, 1)[0]
    }
}

const getuser = (id) => {
    return users.find((user) => user.id===id)
}

const getusersinroom = (room) => {
    return users.filter((user) => {
        user.room === room
    })
}

module.exports = {
    adduser,
    removeuser,
    getuser,
    getusersinroom
}
// adduser({
//     id:21,
//     username: "Sumit Kumar",
//     room:"Family"
// })

// console.log(users)
