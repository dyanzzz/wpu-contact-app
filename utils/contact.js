const fs = require("fs")
const { body, validationResult } = require('express-validator')
const chalk = require('chalk')

// create folder data
const dirPath = './data'
if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath)
}

// create file contact.json
const dataPath = './data/contact.json'
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

const loadContact = () => {
    const file = fs.readFileSync('./data/contact.json', 'utf-8')
    const contacts = JSON.parse(file)
    return contacts
}

const findContact = (name) => {
    const contacts = loadContact()
    const getContact = contacts.find((contact) => contact.name === name)
    return getContact
}

const saveContacts = (contacts) => {
    fs.writeFileSync('./data/contact.json', JSON.stringify(contacts));
}

const checkDuplicate = (name) => {
    const contacts = loadContact()
    return contacts.find((data) => data.name === name)
}

const addContact = (contact) => {
    const contacts = loadContact()

    // find => mencari 1, kalo udah ketemu selesai
    const duplikatName = contacts.find(
        (data) => data.name === contact.name
    )

    if(duplikatName) {
        console.log(chalk.red(`Contact sudah terdaftar, gunakan nama lain`))
        return false
    }

    contacts.push(contact)

    saveContacts(contacts)
    console.log(chalk.green("terimakasih sudah memasukan data"))
}

const deleteContact = (name) => {
    const contacts = loadContact()

    // filter => mencari sampai akhir
    const newContacts = contacts.filter(
        (contact) => contact.name.toLowerCase() !== name.toLowerCase()
    )

    saveContacts(newContacts)
}

const updateContact = (contactBaru) => {
    const contacts = loadContact()

    const newContacts = contacts.filter((data) => data.name.toLowerCase() !== contactBaru.oldName.toLowerCase())



    /* delete contactBaru.oldName

    newContacts.push(contactBaru)
    saveContacts(newContacts)
 */
    console.log(contacts)
    console.log(contactBaru.oldName)
    console.log(newContacts)
    console.log(contactBaru)
}

module.exports = {
    loadContact,
    findContact,
    addContact,
    checkDuplicate,
    deleteContact,
    updateContact
}