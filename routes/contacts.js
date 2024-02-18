var express = require('express');
var router = express.Router();
var Contact = require('../models/contact');


router.get('/', function(req, res, next) {
    Contact.find({})
        .then(contacts => {
            console.log("Fetched contacts:", contacts);
            res.render('form.twig', {
                title: "Contact list",
                cont: contacts
            });
        })
        .catch(err => {
            console.error("Error fetching contacts:", err);
            res.status(500).send("Error fetching contacts");
        });
});

router.get('/add', function(req, res, next) {
    res.render('add_contact.twig', { title: 'Add New Contact' });
});


router.post('/', function(req, res, next) {
    const newContact = new Contact({
        FullName: req.body.FullName,
        Phone: req.body.Phone
    });

    newContact.save()
        .then(savedContact => {
            console.log("New contact added:", savedContact);
            res.redirect('/contacts');
        })
        .catch(error => {
            console.error('Error adding contact:', error);
            res.status(500).json({ error: 'Failed to add contact' });
        });
});



router.get('/:id', function(req, res, next) {
    const contactId = req.params.id;

    
    Contact.findById(contactId)
        .then(contact => {
                res.render('contact_details.twig', { contact: contact });
            
        })
        .catch(error => {
            
            console.error('Error finding contact by ID:', error);
            res.render('error.twig', { message: 'Error finding contact by ID' });
        });
});


router.get('/delete/:id', function(req, res, next) {
    const contactId = req.params.id;
    Contact.findByIdAndDelete(contactId)
        .then(deletedContact => {
            if (!deletedContact) {
                res.render('contacts', { message: 'Contact not found.' });
            } else {
                res.render('contacts', { message: 'Contact deleted successfully.' });
            }
        })
        .catch(error => {
            console.error('Error deleting contact:', error);
            
            res.render('contacts', { message: 'Failed to delete contact.' });
        });
});


router.get('/edit/:id', function(req, res, next) {
    const contactId = req.params.id;

    Contact.findById(contactId)
        .then(contact => {
            res.render('edit_contact.twig', { contact: contact });
        })
        .catch(error => {
            console.error('Error finding contact by ID for edit:', error);
            res.render('error.twig', { message: 'Error finding contact for edit by ID' });
        });
});


router.post('/edit/:id', function(req, res, next) {
    const contactId = req.params.id;

    Contact.findByIdAndUpdate(contactId, {
        FullName: req.body.FullName,
        Phone: req.body.Phone
    }, { new: true })
        .then(updatedContact => {
            console.log("Contact updated:", updatedContact);
            res.redirect('/contacts');
        })
        .catch(error => {
            console.error('Error updating contact:', error);
            res.status(500).json({ error: 'Failed to update contact' });
        });
});
//////
router.get('/', function(req, res, next) {
    const query = req.query.FullName; // Get the search query from the URL
    console.log("Search query:", query); // Add this line for debugging

    if (query) {
        // If there's a search query, filter contacts based on the query
        Contact.find({ FullName: { $regex: new RegExp(query, 'i') } })
            .then(filteredContacts => {
                console.log("Filtered contacts:", filteredContacts); // Add this line for debugging
                res.render('form.twig', {
                    title: `Search Results for "${query}"`,
                    cont: filteredContacts
                });
            })
            .catch(err => {
                console.error("Error fetching contacts:", err);
                res.status(500).send("Error fetching contacts");
            });
    } else {
        // If no search query, fetch all contacts
        Contact.find({})
            .then(allContacts => {
                console.log("Fetched contacts:", allContacts);
                res.render('form.twig', {
                    title: "Contact list",
                    cont: allContacts
                });
            })
            .catch(err => {
                console.error("Error fetching contacts:", err);
                res.status(500).send("Error fetching contacts");
            });
    }
});


module.exports = router;