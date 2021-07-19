const express = require("express");
const expressLayouts = require('express-ejs-layouts');
// morgan untuk monitoring log dari nodejs secara mendetail
const morgan = require('morgan')
const app = express();

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const { body, validationResult, check, cookie } = require('express-validator')

const { loadContact, findContact, addContact, checkDuplicate, deleteContact, updateContact } = require('./utils/contact')

const port = 3000;

// membuat instance template view EJS
app.set("view engine", "ejs");

// third party midleware
app.use(expressLayouts);
app.use(morgan('dev'))

// build-in middleware
app.use(express.static('public'))

// build-in middleware urlencoded
app.use(express.urlencoded({ extended: true }))

// configure flash
app.use(cookieParser('secret'))
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)
app.use(flash())

app.get("/", (req, res) => {
  const mahasiswa = [
    
  ];

  res.render("index", {
    name: "budii",
    title: "Home",
    layout: 'layouts/main-layout',
    mahasiswa: mahasiswa,
  });
});

app.get("/contact", function (req, res) {

  const contacts = loadContact()

  res.render("contact", {
    title: 'Contact',
    layout: 'layouts/main-layout',
    contacts,
    msg: req.flash('msg')
  });
});

// form add data contact
app.get("/contact/add", (req, res) => {
  res.render("add", {
    title: "Add Contact",
    layout: 'layouts/main-layout',
  })
})

// proses submit
app.post("/contact", 
  [
    body('name').custom((value) => {
      const duplikatName = checkDuplicate(value)

      if(duplikatName) {
          throw new Error('Name already exist')
      }
      return true
    }),
    body('email', "Email tidak valid").isEmail(),
    body('hp', "No hp tidak valid").isMobilePhone('id-ID')
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('add', {
        title: 'Form Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array()
      })
    } else {
      addContact(req.body)
      // kirim message flash
      req.flash('msg', 'Data contact berhasil ditambahkan')
      res.redirect('/contact')
    }
})

app.get('/contact/delete/:name', (req, res) => {
  const contact = findContact(req.params.name)

  if (!contact) {
    res.status(404)
    res.send('<h1>404</h1>')
  } else {
    deleteContact(req.params.name)

    req.flash('msg', 'Data contact berhasil dihapus')
      res.redirect('/contact')
  }
})

// form edit data contact
app.get("/contact/edit/:name", (req, res) => {
  const contact = findContact(req.params.name)

  res.render("edit", {
    title: "Form Edit Data Contact",
    layout: 'layouts/main-layout',
    contact
  })
})

app.post("/contact/update", 
  [
    body('name').custom((value, { req }) => {
      const duplikatName = checkDuplicate(value)

      if(value !== req.body.oldName && duplikatName) {
          throw new Error('Name already exist')
      }
      return true
    }),
    body('email', "Email tidak valid").isEmail(),
    body('hp', "No hp tidak valid").isMobilePhone('id-ID')
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('edit', {
        title: 'Form Edit Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        contact: req.body
      })
    } else {
      //res.send(req.body)
      updateContact(req.body)
      // kirim message flash
      req.flash('msg', 'Data contact berhasil diubah')
      res.redirect('/contact')
    }
})


app.get("/contact/:name", function (req, res) {

  const contact = findContact(req.params.name)

  res.render("detail", {
    title: 'Detail Contact',
    layout: 'layouts/main-layout',
    contact
  });
});




app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => [console.log(`Server is listen on port ${port}`)]);
