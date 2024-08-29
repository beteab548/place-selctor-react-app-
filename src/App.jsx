import { useEffect, useRef, useState } from "react";
import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

function App() {
  const memoStoredIds = JSON.parse(localStorage.getItem("stored_Ids")) || [];
  const selectedPlace = useRef();
  const [showModal, setShowModal] = useState(false);
  const [pickedPlaces, setPickedPlaces] = useState(memoStoredIds);
  const [sortedplacesArray, setSortedPlacesArray] = useState([]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setSortedPlacesArray(sortedPlaces);
    });
  }, []);
  function handleStartRemovePlace(id) {
    setShowModal(true);
    selectedPlace.current = id;
    const sortedplacesArray =
      JSON.parse(localStorage.getItem("stored_Ids")) || [];
    console.log(sortedplacesArray);
    const updatedSortedplacesArray = sortedplacesArray.filter(
      (storedPlacesid) => {
        return storedPlacesid.id !== id;
      }
    );
    localStorage.setItem(
      "stored_Ids",
      JSON.stringify(updatedSortedplacesArray)
    );
  }
  function handleStopRemovePlace() {
    setShowModal(false);
  }
  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        const prevstoredId =
          JSON.parse(localStorage.getItem("stored_Ids")) || [];
        localStorage.setItem(
          "stored_Ids",
          JSON.stringify([...prevPickedPlaces])
        );
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      const prevstoredId = JSON.parse(localStorage.getItem("stored_Ids")) || [];
      localStorage.setItem(
        "stored_Ids",
        JSON.stringify([place, ...prevPickedPlaces])
      );
      return [place, ...prevPickedPlaces];
    });
  }
  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setShowModal(false);
  }
  return (
    <>
      <Modal open={showModal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>
      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={sortedplacesArray}
          fallbackText={"waiting to sort the places..."}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
