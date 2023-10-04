import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [contactList, setContactList] = useState([]);
  const [name, setName] = useState("");

 // Function to add a new person to the contact list
const AddName = async () => {
  try {
    // Send a POST request to the server to add a person
    const response = await axios.post("http://localhost:5000/addPerson", {
      name: name,
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
  const response = await axios.delete(`http://localhost:5000/deletepersonbyid/${id}`);
  if (response.status === 200) {
    setContactList(response.data); // Update the contact list after successful deletion
    alert("User deleted"); // Show a success message
  } else {
    alert("Something went wrong!"); // Show an error message if the deletion fails
  }
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
      <input
        type="text"
        name="name"
        value={name}
        placeholder="Add your name please"
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
      <button onClick={() => AddName()}>Add</button>
      <ul>
        {contactList.map((contact, key) => (
          <li key={key}>{contact.name} <button onClick={()=>DeletePerson(contact._id)}>X</button></li>
        ))}
      </ul>
    </div>
  );
}

export default App;
