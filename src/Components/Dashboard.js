import React from 'react'
import { useEffect, useState } from "react";
        
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup'
function Dashboard() {

    const [contactList, setContactList] = useState([]);
  const [name, setName] = useState('');
  const [editedName, setEditedName] = useState("");
  const [editedContactId, setEditedContactId] = useState(null);

  const contactSchema = Yup.object({
    name:Yup.string().required("please add a name")

  })
  const { values, errors, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: { name:name },
    validationSchema:contactSchema,
    onSubmit: (values) => {
      values.name = ""
console.log("values",values.name);
      AddName(values.name)
    },
  });

  // Function to add a new person to the contact list
  const AddName = async (value) => {
    try {
      // Send a POST request to the server to add a person
      const response = await axios.post("http://localhost:5000/addPerson", {
        name: value,
        age: null,
        favFood: [""],
      });
      // If the request is successful (status code 200), update the state
      if (response.status === 200) {
        setName(""); // Clear the input field
        setContactList([...contactList, response.data]); // Add the new person to the contact list
      }
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };

  // Function to delete a person by their ID
  const DeletePerson = async (id) => {
    console.log("this is the id", id);
    // Send a DELETE request to the server to delete a person by ID
    const response = await axios.delete(
      `http://localhost:5000/deletepersonbyid/${id}`
    );
    if (response.status === 200) {
      setContactList(response.data); // Update the contact list after successful deletion
      alert("User deleted"); // Show a success message
    } else {
      alert("Something went wrong!"); // Show an error message if the deletion fails
    }
  };

  // Function to handle editing a contact's name
  const EditName = async () => {
    try {
      // Send a PUT request to the server to update the contact's name
      const response = await axios.put(
        `http://localhost:5000/updatepersonbyid/${editedContactId}`,
        {
          name: editedName,
        }
      );
      if (response.status === 200) {
        // Update the contact's name in the local state
        const updatedContacts = contactList.map((contact) => {
          if (contact._id === editedContactId) {
            return { ...contact, name: editedName };
          }
          return contact;
        });
        setContactList(updatedContacts);
        setEditedName("");
        setEditedContactId(null);
      }
    } catch (error) {
      console.log(error); // Log any errors that occur during the request
    }
  };
  const handleEditContact = (contact) => {
    setEditedName(contact.name);
    setEditedContactId(contact._id);
  };

  // UseEffect hook to fetch the initial list of contacts when the component mounts
  useEffect(() => {
    const getContacts = async () => {
      try {
        // Send a GET request to the server to fetch the list of persons
        const response = await axios.get("http://localhost:5000/getPersons");
        console.log(response); // Log the response for debugging
        setContactList(response.data); // Update the contact list with the fetched data
      } catch (error) {
        console.log(error); // Log any errors that occur during the request
      }
    };
    getContacts(); // Call the getContacts function when the component mounts (empty dependency array)
  }, []);

  return (
    <div className="App">
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={values.name}
        onBlur={handleBlur}
        placeholder="Add your name please"
        onChange={handleChange}
      />

      <button type="submit">Add</button>
      {errors.name  && <div>{errors.name}</div>}

    </form>
    <ul>
      {contactList.map((contact) => (
        <li key={contact._id}>
          {contact._id === editedContactId ? (
            <>
              <input
                type="text"
                value={editedName}
                onChange={(event) => setEditedName(event.target.value)}
              />
              <button onClick={() => EditName()}>Save</button>
            </>
          ) : (
            <>
              {contact.name}{" "}
              <button onClick={() => handleEditContact(contact)}>Edit</button>{" "}
              <button onClick={() => DeletePerson(contact._id)}>X</button>
            </>
          )}
        </li>
      ))}
    </ul>
  </div>
  )
}

export default Dashboard
