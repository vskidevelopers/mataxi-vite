// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  setDoc,
  getDoc,
  getDocs,
  doc,
  collection,
  updateDoc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDB_xquu4T4mLBvXdWxVlacMEPw5d0Ppmg",
  authDomain: "mataxi-d8046.firebaseapp.com",
  projectId: "mataxi-d8046",
  storageBucket: "mataxi-d8046.appspot.com",
  messagingSenderId: "890852158068",
  appId: "1:890852158068:web:96578f985aac02a9887f21",
  measurementId: "G-7QSZNK7F11",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const driverUser = getAuth(app);
export const authUser = getAuth(app);

export const useProfileFunctions = () => {
  const [user, setUser] = useState(null);
  const [profilePictureUploadProgress, setProfilePictureUploadProgress] =
    useState(0);
  const [inspectionReportUploadProgress, setInspectionReportUploadProgress] =
    useState(0);
  const [insurancePolicyUploadProgress, setinsurancePolicyUploadProgress] =
    useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [profilePictureImageURL, setProfilePictureImageURL] = useState(null);
  const [inspectionReportImageURL, setInspectionReportImageURL] =
    useState(null);
  const [insurancePolicyImageURL, setInsurancePolicyImageURL] = useState(null);
  const [createdUser, setCreatedUser] = useState(null);

  const driverUserName = localStorage.getItem("username");

  const uploadProfilePicture = async (file) => {
    // Initialize the result object
    const result = {
      data: null,
      status: "pending",
    };

    console.log("Uploading Profile Picture >>", file);

    // Upload file and metadata to the object 'images/mountains.jpg'
    const metadata = {
      contentType: "image/jpeg",
    };
    const storageRef = ref(storage, "driverProfilePictures/" + file.name);

    try {
      setLoading(true);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setProfilePictureUploadProgress(
            parseInt(parseFloat(progress).toFixed(0))
          );

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle errors
          result.status = "error";
          result.error = error;
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log("File available at", downloadURL);
              setProfilePictureImageURL(downloadURL);
              setLoading(false);
              // Update the result object with the download URL and status
              result.data = downloadURL;
              result.status = "success";
            })
            .catch((error) => {
              // Handle errors when getting the download URL
              result.status = "error";
              result.error = error;
            });
        }
      );
    } catch (err) {
      // Handle any other errors that may occur
      console.log("the following error occurred >>", err);
      result.status = "error";
      result.error = err;
    }
    console.log("profile pic res >>", result);
    return result; // Return the result object
  };

  const uploadInspectionReport = async (file) => {
    // Initialize the result object
    const result = {
      data: null,
      status: "pending",
    };
    console.log("Uploading Inspection Report >>", file);

    // Upload file and metadata to the object 'images/mountains.jpg'
    const metadata = {
      contentType: "image/jpeg",
    };
    const storageRef = ref(storage, "vehicleInspectionReports/" + file.name);

    try {
      setLoading(true);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setInspectionReportUploadProgress(
            parseInt(parseFloat(progress).toFixed(0))
          );

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle errors
          result.status = "error";
          result.error = error;
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log("File available at", downloadURL);
              setInspectionReportImageURL(downloadURL);
              setLoading(false);
              // Update the result object with the download URL and status
              result.data = downloadURL;
              result.status = "success";
            })
            .catch((error) => {
              // Handle errors when getting the download URL
              result.status = "error";
              result.error = error;
            });
        }
      );
    } catch (err) {
      // Handle any other errors that may occur
      console.log("the following error occurred >>", err);
      result.status = "error";
      result.error = err;
    }

    return result; // Return the result object
  };

  const uploadInsurancePolicy = async (file) => {
    // Initialize the result object
    const result = {
      data: null,
      status: "pending",
    };

    console.log("Uploading Insurance Policy >>", file);

    // Upload file and metadata to the object 'images/mountains.jpg'
    const metadata = {
      contentType: "image/jpeg",
    };
    const storageRef = ref(storage, "vehicleInsurancePolicies/" + file.name);

    try {
      setLoading(true);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setinsurancePolicyUploadProgress(
            parseInt(parseFloat(progress).toFixed(0))
          );

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle errors
          result.status = "error";
          result.error = error;
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log("File available at", downloadURL);
              setInsurancePolicyImageURL(downloadURL);
              setLoading(false);
              // Update the result object with the download URL and status
              result.data = downloadURL;
              result.status = "success";
            })
            .catch((error) => {
              // Handle errors when getting the download URL
              result.status = "error";
              result.error = error;
            });
        }
      );
    } catch (err) {
      // Handle any other errors that may occur
      console.log("the following error occurred >>", err);
      result.status = "error";
      result.error = err;
    }

    return result; // Return the result object
  };

  const updateDriverProfile = async (data) => {
    try {
      setLoading(true);
      console.log("states ...");
      console.log("Data to use in setDoc() >>", data);
      const driverProfileRef = doc(
        db,
        "DriverProfiles",
        driverUser.currentUser.uid
      );
      await updateDoc(driverProfileRef, {
        ...data,
        userId: driverUser.currentUser.uid,
      });
      console.log("driver user >>", driverUser);

      setLoading(false);

      return {
        status: "success",
        code: 200,
        message: "Driver profile created successfully",
        driverProfileRef,
      };
    } catch (error) {
      setLoading(false);
      console.error("Error creating driver profile:", error);
      return {
        status: "error",
        code: 500,
        message: "Failed to create driver profile",
      };
    }
  };

  // Add vehicle to specific doc
  const addVehicle = async (data, rideType) => {
    try {
      const rideTypeRef = collection(
        db,
        "VehicleCollection",
        rideType,
        rideType
      );
      const newVehicleRef = doc(rideTypeRef);
      await setDoc(newVehicleRef, data);
      return { success: true, message: "Vehicle added successfully" };
    } catch (error) {
      return { success: false, message: "Failed to add the vehicle" };
    }
  };

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        driverUser,
        email,
        password
      );
      setCreatedUser(userCredential.user);
      return userCredential;
    } catch (err) {
      console.error("failed to create a user >>", err);
      throw err;
    }
  };

  // Create Driver User
  const createDriverUser = async (data) => {
    console.log("Creating Driver User...");
    console.log("Driver User Data >> ", data);
    let userCredential;
    try {
      userCredential = await signup(data.email, data.password);
      console.log("user credentials >>", userCredential);
      const createdUser = userCredential.user;
      console.log("created user >>", userCredential);
      if (createdUser) {
        const driverData = {
          driverPicture: null,
          driverUsername: data.fullName,
          inspectionReport: null,
          insurancePolicy: null,
          licenseExpirationDate: null,
          licenseNumber: null,
          sacco: data.sacco.sacco,
          seatCapacity: null,
          vehicleColor: null,
          vehicleMake: null,
          vehicleModel: null,
        };
        // Use the user's UID as the document ID
        await setDoc(doc(db, "DriverProfiles", createdUser.uid), driverData);
        return {
          user: createdUser,
          driverData: driverData,
        };
      }
    } catch (err) {
      console.log("err >>", err);
      return { error: err };
    }
  };

  // Create Rider User
  const createRiderUser = async (data) => {
    console.log("Creating Rider User...");
    let userCredential;
    try {
      userCredential = await signup(data.email, data.password);
      console.log("user credentials >>", userCredential);
      const createdUser = userCredential.user;
      console.log("created user >>", userCredential);
      if (createdUser) {
        console.log("Created Rider User >>", createdUser.uid);
        const riderData = {
          name: data.username,
          email: data.email,
          mmemonics: data.mmemonics,
          paymail: data.paymail,
          public_key: data.public_key,
          secret_key: data.secret_key,
          userId: createdUser.uid,
        };
        await setDoc(doc(db, "RiderUsers", createdUser.uid), riderData);
        return {
          success: true,
          user: createdUser,
          riderData: riderData,
        };
      }
    } catch (err) {
      console.log("err >>", err);
      return { success: false, error: err };
    }
  };

  // Create User based on the user type (Admin, Employee, Driver, or Rider)
  const createUser = async (data) => {
    console.log("Received User Data");
    console.log("Checking User Type...");
    if (data.userType === "driver") {
      return await createDriverUser(data);
    } else if (data.userType === "rider") {
      return await createRiderUser(data);
    }
  };

  const checkDriverStatus = async (uid) => {
    const driverDocRef = doc(db, "DriverProfiles", uid);

    try {
      const docSnapshot = await getDoc(driverDocRef);
      return docSnapshot.exists(); // Return true if the document exists, indicating admin status
    } catch (error) {
      console.error("Error checking driver status:", error);
      throw error;
    }
  };

  const fetchRiderUserInfo = async (uid) => {
    const riderDocRef = doc(db, "RiderUsers", uid);
    try {
      const riderDocSnap = await getDoc(riderDocRef);
      if (riderDocSnap.exists()) {
        console.log("riderUser data: ", riderDocSnap.data());
        return { success: true, data: riderDocSnap.data() };
      } else {
        console.log("Rider Doc don't exist");
        return { success: false, data: "Rider don't exist" };
      }
    } catch (error) {
      console.error("error occured while fetching rider >> ", error);
      throw error;
    }
  };

  const fetchDriverUserInfo = async (uid) => {
    const driverDocRef = doc(db, "DriverProfiles", uid);
    try {
      const driverDocSnap = await getDoc(driverDocRef);
      if (driverDocSnap.exists()) {
        console.log("driverUser data: ", driverDocSnap.data());
        return { success: true, data: driverDocSnap.data() };
      } else {
        console.log("driver Doc don't exist");
        return { success: false, data: "driver don't exist" };
      }
    } catch (error) {
      console.error("error occured while fetching driver >> ", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    console.log("logging in ... ");
    console.log("email >> ", email);
    console.log("password >> ", password);

    try {
      // Authenticate the user with the provided email and password
      const userCredential = await signInWithEmailAndPassword(
        driverUser,
        email,
        password
      );
      setUser(userCredential.user);
      setLoading(false);

      // Check if the logged-in user is a driver
      const isDriverUser = await checkDriverStatus(userCredential.user.uid);

      // Set a local storage key to indicate driver status
      if (isDriverUser) {
        localStorage.setItem("isDriver", "true");
        localStorage.setItem("isAuth", "true");
      } else {
        localStorage.removeItem("isDriver");
      }

      // Optionally perform any additional actions after successful login

      // Return a success message or code
      return { success: true, message: "Login successful" };
    } catch (error) {
      // Handle authentication errors
      console.error("Login failed", error);
      setError(error.code);
      setLoading(false);

      // Return an error message or code
      return { success: false, error: error.code };
    }
  };

  const logout = async () => {
    await signOut(driverUser);
    localStorage.clear();
  };

  return {
    profilePictureUploadProgress,
    inspectionReportUploadProgress,
    insurancePolicyUploadProgress,
    loading,
    profilePictureImageURL,
    inspectionReportImageURL,
    insurancePolicyImageURL,
    uploadProfilePicture,
    uploadInspectionReport,
    uploadInsurancePolicy,
    updateDriverProfile,
    fetchDriverUserInfo,
    fetchRiderUserInfo,
    createUser,
    addVehicle,
    login,
    logout,
  };
};

export const useRoutesAndBookingFuntions = () => {
  const [loading, setLoading] = useState(false);
  const [approvedRoutes, setApprovedRoutes] = useState([]);
  const [mataxiStandard, setMataxiStandard] = useState([]);
  const [mataxiXl, setMataxiXl] = useState([]);
  const [mataxiLuxe, setMataxiLuxe] = useState([]);

  const registerNewRoute = async (data) => {
    try {
      console.log("new route data >>", data);
      const newRouteRef = doc(collection(db, "RouteCollection"));
      await setDoc(newRouteRef, data);
      return { success: true, message: "New route added successfully" };
    } catch (error) {
      console.error("error occured while registering a new route >>", error);
      return { success: false, message: "Failed to register a new route " };
    }
  };

  const fetchRoutes = async () => {
    const routesCollectionRef = collection(db, "RouteCollection");
    const q = query(routesCollectionRef, where("approved", "==", true));
    const approvedRoutesSnapshot = await getDocs(q);
    const approvedRoutesData = approvedRoutesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("setting routes to approvedRoutes state ...");
    setApprovedRoutes(approvedRoutesData);
    console.log("complete! approvedRoutesData >>", approvedRoutesData);
  };

  const fetchMataxis = async (mataxiType, setMataxiState) => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "VehicleCollection", mataxiType, mataxiType)
      );

      const mataxiData = [];
      if (querySnapshot?.empty) {
        console.log("empty snapshot");
      } else {
        querySnapshot.forEach((doc) => {
          mataxiData.push({ id: doc.id, ...doc.data() });
        });
        console.log("mataxi data >> ", mataxiData);

        console.log(`Setting ${mataxiType} routes to state ...`);
        setMataxiState(mataxiData);
        console.log(`Complete! ${mataxiType} data >>`, mataxiData);
      }
    } catch (error) {
      console.error(
        `Error fetching mataxi data for << ${mataxiType} >>:`,
        error
      );
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchSelectedVehicleDetails = async (selectedRideType) => {
    let subCollectionName = "";

    if (selectedRideType === "Mataxi Standard") {
      subCollectionName = "mataxiStandard";
    } else if (selectedRideType === "Mataxi XL") {
      subCollectionName = "mataxiXl";
    } else if (selectedRideType === "Mataxi Luxe") {
      subCollectionName = "mataxiLuxe";
    }

    if (subCollectionName) {
      console.log("selectedRideType for ref >>", subCollectionName);
      const vehicleCollectionRef = collection(
        db,
        "VehicleCollection",
        subCollectionName,
        subCollectionName
      );
      const vehicleQuery = query(vehicleCollectionRef);

      const vehicleSnapshot = await getDocs(vehicleQuery);

      if (vehicleSnapshot?.empty) {
        console.log("No vehicle exists in the selected Category");
        return {
          success: false,
          data: null,
          message: `No vehicle exists in the selected Category >> ${selectedRideType}`,
        };
      } else {
        console.log("vehicleSnapShot from fetchVehicle >> ", vehicleSnapshot);
        const vehicleData = vehicleSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // setSelectedVehicleDetails(vehicleData[0]);
        return {
          success: true,
          data: vehicleData[0],
          message: "Vehicles exists in the selected category",
        };
      }
    } else {
      return {
        success: false,
        data: null,
        message: "selected category does not exist!",
      };
    }
  };

  const fetchAllMataxis = async () => {
    console.log("fetching all vehicles ...");
    let subCollectionNames = ["mataxiStandard", "mataxiXl", "mataxiLuxe"];

    if (subCollectionNames) {
      const fetchPromises = subCollectionNames.map(
        async (subCollectionName) => {
          const vehicleCollectionRef = collection(
            db,
            "VehicleCollection",
            subCollectionName,
            subCollectionName
          );
          const vehicleQuery = query(vehicleCollectionRef);

          const vehicleSnapshot = await getDocs(vehicleQuery);

          console.log(
            `snaopshots of  >> ${subCollectionName} : `,
            vehicleSnapshot
          );

          if (vehicleSnapshot?.empty) {
            console.log(
              "No vehicle exists in the selected Category >> ",
              subCollectionName
            );
            return {
              mataxiRideType: subCollectionName,
              success: false,
              data: null,
              message: `No vehicle exists in the selected Category >> ${subCollectionName}`,
            };
          } else {
            console.log(
              "vehicleSnapShot from fetchVehicle >> ",
              vehicleSnapshot
            );
            const vehicleData = vehicleSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            return {
              mataxiRideType: subCollectionName,
              success: true,
              data: vehicleData,
              message: `Vehicles exist in the ${subCollectionName} category`,
            };
          }
        }
      );

      const results = await Promise.all(fetchPromises);
      return results;
    } else {
      return {
        success: false,
        data: null,
        message: "selected categories do not exist!",
      };
    }
  };

  const fetchAllVehiclesInCollectionWithRideType = async (
    collectionName,
    selectedRideType
  ) => {
    let subCollectionName = "";

    if (selectedRideType === "Mataxi Standard" || "MATAXI_STD") {
      subCollectionName = "mataxiStandard";
    } else if (selectedRideType === "Mataxi XL" || "MATAXI_XL") {
      subCollectionName = "mataxiXl";
    } else if (selectedRideType === "Mataxi Luxe" || "MATAXI_LUXE") {
      subCollectionName = "mataxiLuxe";
    }

    if (subCollectionName) {
      console.log("selectedRideType for ref >>", subCollectionName);
      const vehicleCollectionRef = collection(
        db,
        collectionName,
        subCollectionName,
        subCollectionName
      );
      const vehicleQuery = query(vehicleCollectionRef);

      const vehicleSnapshot = await getDocs(vehicleQuery);

      if (vehicleSnapshot?.empty) {
        console.log("No vehicle exists in the selected Category");
        return {
          success: false,
          data: null,
          message: `No vehicle exists in the selected Category >> ${selectedRideType}`,
        };
      } else {
        console.log("vehicleSnapShot from fetchVehicle >> ", vehicleSnapshot);
        const vehicleData = vehicleSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return {
          success: true,
          data: vehicleData,
          message: "Vehicles exists in the selected category",
        };
      }
    } else {
      return {
        success: false,
        data: null,
        message: "selected category does not exist!",
      };
    }
  };

  const fetchAllVehiclesInCollection = async (collectionName) => {
    console.log(`fetching all vehicles from ${collectionName}...`);
    let subCollectionNames = ["mataxiStandard", "mataxiXl", "mataxiLuxe"];

    if (subCollectionNames) {
      const fetchPromises = subCollectionNames.map(
        async (subCollectionName) => {
          const vehicleCollectionRef = collection(
            db,
            collectionName,
            subCollectionName,
            subCollectionName
          );
          const vehicleQuery = query(vehicleCollectionRef);

          const vehicleSnapshot = await getDocs(vehicleQuery);

          console.log(
            `snapshots of  >> ${subCollectionName} : `,
            vehicleSnapshot
          );

          if (vehicleSnapshot?.empty) {
            console.log(
              "No vehicle exists in the selected Category >> ",
              subCollectionName
            );
            return {
              mataxiRideType: subCollectionName,
              success: false,
              data: null,
              message: `No vehicle exists in the selected Category >> ${subCollectionName}`,
            };
          } else {
            console.log(
              "vehicleSnapShot from fetchVehicle >> ",
              vehicleSnapshot
            );
            const vehicleData = vehicleSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            return {
              mataxiRideType: subCollectionName,
              success: true,
              data: vehicleData,
              message: `Vehicles exist in the ${subCollectionName} category`,
            };
          }
        }
      );

      const results = await Promise.all(fetchPromises);
      return results;
    } else {
      return {
        success: false,
        data: null,
        message: "selected categories do not exist!",
      };
    }
  };

  const fetchSaccos = async () => {
    try {
      const saccoCollectionRef = collection(db, "SaccoCollection");
      const saccoCollectionSnapShot = await getDocs(saccoCollectionRef);

      if (saccoCollectionSnapShot.empty) {
        console.log("No registered Saccos Found");
        return {
          success: false,
          saccos: null,
        };
      } else {
        const saccoCollectionData = saccoCollectionSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return {
          success: true,
          saccos: saccoCollectionData,
        };
      }
    } catch (error) {
      console.log("the following error occured >> ", error);
      return {
        success: false,
        error: error,
        saccos: null,
      };
    }
  };

  const fetchAllSaccoMataxis = async (saccoName) => {
    console.log("fetching all vehicles ...");
    let subCollectionNames = ["mataxiStandard", "mataxiXl", "mataxiLuxe"];

    if (subCollectionNames) {
      const fetchPromises = subCollectionNames.map(
        async (subCollectionName) => {
          const vehicleCollectionRef = collection(
            db,
            "VehicleCollection",
            subCollectionName,
            subCollectionName
          );
          const vehicleQuery = query(
            vehicleCollectionRef,
            where("saccoName", "==", saccoName)
          );

          const vehicleSnapshot = await getDocs(vehicleQuery);

          if (vehicleSnapshot?.empty) {
            console.log(
              `No vehicle exists in the ${subCollectionName} for Sacco : ${saccoName} `
            );
            return {
              mataxiRideType: subCollectionName,
              saccoName: saccoName,
              success: false,
              data: null,
              message: `No vehicle exists in the selected Category >> ${subCollectionName}`,
            };
          } else {
            console.log(
              `vehicleSnapShot from fetchVehicle for Sacco: ${saccoName} `,
              vehicleSnapshot
            );
            const vehicleData = vehicleSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            return {
              mataxiRideType: subCollectionName,
              saccoName: saccoName,
              success: true,
              data: vehicleData,
              message: `Vehicles exist in the ${subCollectionName} for ${saccoName}`,
            };
          }
        }
      );

      const results = await Promise.all(fetchPromises);
      return results;
    } else {
      return {
        success: false,
        data: null,
        message: "selected categories do not exist!",
      };
    }
  };

  const checkIfVehicleExistsInTheBookingAllocationCollection = async (
    selectedRideType,
    vehicleId
  ) => {
    let subCollectionName = "";

    if (selectedRideType === "Mataxi Standard") {
      subCollectionName = "mataxiStandard";
    } else if (selectedRideType === "Mataxi XL") {
      subCollectionName = "mataxiXl";
    } else if (selectedRideType === "Mataxi Luxe") {
      subCollectionName = "mataxiLuxe";
    }

    if (subCollectionName && vehicleId) {
      console.log("selectedRideType for ref >>", subCollectionName);
      console.log("vehicleId for ref >>", vehicleId);

      let vehicleBookedSnapshot;
      // Query to check if the vehicle exists
      try {
        const vehicleDocRef = doc(
          db,
          "BookingAllocationCollection",
          subCollectionName,
          subCollectionName,
          vehicleId
        );

        vehicleBookedSnapshot = await getDoc(vehicleDocRef);
      } catch (error) {
        console.log("vehicleDocRef dont work >> ", error);
      }

      // Check if the document exists
      if (vehicleBookedSnapshot.exists()) {
        const bookedVehicleData = vehicleBookedSnapshot?.data();
        console.log("vehicleSnapshot exist! >> ", bookedVehicleData);
        console.log(
          `Proceeding with selcted vehicle ${
            bookedVehicleData?.vehicleNumberPlate
              ? bookedVehicleData?.vehicleNumberPlate
              : "<<plate goes here>>"
          } ...`
        );

        return {
          success: true,
          data: bookedVehicleData,
          isFull: bookedVehicleData.isFull,
          isAvailable: bookedVehicleData.isAvailable,
        };
      } else {
        // procees add Vehicle data to the collectiomn
        return { success: false, error: "Vehicle not found" };
      }
    }
  };

  const addSelectedVehicleToBookingAllocationCollection = async (
    selectedRideType,
    data
  ) => {
    console.log("data checking before adding vehicle to collection ... ");
    console.log("data >> ", data);

    let subCollectionName = "";

    if (selectedRideType === "Mataxi Standard") {
      subCollectionName = "mataxiStandard";
    } else if (selectedRideType === "Mataxi XL") {
      subCollectionName = "mataxiXl";
    } else if (selectedRideType === "Mataxi Luxe") {
      subCollectionName = "mataxiLuxe";
    }

    const availableSeats = generateSeatNumbers(
      data?.vehicleNumberPlate,
      data?.seatCapacity
    );
    console.log("generated Seat numbers >> ", availableSeats);
    const newBookingAllocationCollectionData = {
      ...data,
      isFull: false,
      availableSeats: availableSeats,
      bookedSeats: [],
    };
    console.log("rideType >> ", subCollectionName);
    try {
      const bookingAllocationCollectionRef = doc(
        db,
        "BookingAllocationCollection",
        subCollectionName,
        subCollectionName,
        data?.id
      );

      await setDoc(
        bookingAllocationCollectionRef,
        newBookingAllocationCollectionData
      );
      return {
        success: true,
        message: "vehicle added successfully in Booking Allocation Collection",
        data: newBookingAllocationCollectionData,
      };
    } catch (error) {
      return {
        success: false,
        message: "vehicle could not be added to BookingAllocationCollection",
        error: error,
      };
    }
  };

  const getSelectedRoute = async (pickupPoint, destination) => {
    console.log(
      `pickup point selected >> ${pickupPoint} destination >> ${destination}`
    );

    try {
      const selectedRouteRef = collection(db, "RouteCollection");
      const selectedRouteQuery = query(
        selectedRouteRef,
        where("endPoint", "==", destination),
        where("startPoint", "==", pickupPoint)
      );
      const selectedRouteQuerySnapShot = await getDocs(selectedRouteQuery);
      console.log(
        "selectedRouteQuerySnapShot >>> ",
        selectedRouteQuerySnapShot
      );

      if (selectedRouteQuerySnapShot?.empty) {
        return {
          success: false,
          message: "No Route Found",
        };
      } else {
        const selectedRoutesData = selectedRouteQuerySnapShot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );
        return {
          success: true,
          data: selectedRoutesData[0],
          message: "route exists",
        };
      }
    } catch (error) {
      console.error("error from get selcted Routes >>", error);
      return {
        success: false,
        data: null,
        error: error,
      };
    }
  };

  const registerNewBooking = async (bookingData) => {
    const bookingCollectionData = { ...bookingData, booked: true, paid: false };

    console.log("bookingCollectionData >> ", bookingCollectionData);
    try {
      const newBookingColRef = doc(collection(db, "BookingCollection"));
      await setDoc(newBookingColRef, bookingCollectionData);
      return {
        success: true,
        message: "successfully registered a new booking",
        bookingId: newBookingColRef.id,
      };
    } catch (error) {
      console.error("Error registering new booking:", error);
      throw error;
    }
  };

  const updateBookingPaidStatus = async (bookingId) => {
    try {
      const bookingTicketRef = doc(db, "BookingCollection", bookingId);

      await updateDoc(bookingTicketRef, {
        paid: true,
      });

      return {
        success: true,
        data: `updated paid status of booking Ticket Number : #${bookingId}`,
      };
    } catch (error) {
      console.error(
        "the following error occured during updating booking Paid Status"
      );
      throw error;
    }
  };

  const generateSeatNumbers = (vehicleNumberPlate, seatCapacity) => {
    const seatNumbers = [];

    for (let index = 0; index < seatCapacity; index++) {
      const seatNumber = `${vehicleNumberPlate}_seat${index + 1}`;
      seatNumbers.push(seatNumber);
    }

    return seatNumbers;
  };

  const updateSeatNumberBooking = async (bookingData) => {
    console.log("booking Data >> ", bookingData);
    try {
      const { vehicleId, rideType, vehicleNumberPlate, selectedSeats } =
        bookingData;
      let subCollectionName = "";

      if (rideType === "Mataxi Standard") {
        subCollectionName = "MataxiStandard";
      } else if (rideType === "Mataxi XL") {
        subCollectionName = "MataxiXl";
      } else if (rideType === "Mataxi Luxe") {
        subCollectionName = "MataxiLuxe";
      }

      // TODO:
      // UPDATE THIS REF TO USE VEHICLE uid for faster doc ref instead of query
      const bookingAllocationCollectionDocRef = doc(
        db,
        "BookingAllocationCollection",
        subCollectionName,
        subCollectionName,
        vehicleId
      );
      const availableVehicleCollectionDocRef = doc(
        db,
        "availableVehicleCollection",
        subCollectionName,
        subCollectionName,
        vehicleId
      );

      const vehicleSnapshot = await getDoc(bookingAllocationCollectionDocRef);
      const availableVehicleSnapshot = await getDoc(
        availableVehicleCollectionDocRef
      );

      // Check if the document exists
      if (vehicleSnapshot.exists()) {
        const vehicleDoc = vehicleSnapshot.data();

        console.log("vehicleDoc picked >> ", vehicleDoc);
        const currentBookedSeats = vehicleDoc?.bookedSeats;
        console.log("currentBookedSeats >> ", currentBookedSeats);

        const updatedBookedSeats = [...currentBookedSeats, ...selectedSeats];
        console.log("updatedBookedSeats >> ", updatedBookedSeats);

        const updatedAvailableSeats = vehicleDoc?.availableSeats.filter(
          (seat) => !updatedBookedSeats.includes(seat)
        );
        const isFull = updatedAvailableSeats.length === 0;
        console.log("isFull as per after booking >> ", isFull);
        console.log("updatedAvailableSeats >> ", updatedAvailableSeats);
        // Update the vehicle document in BookingAllocationCollection
        try {
          await updateDoc(bookingAllocationCollectionDocRef, {
            availableSeats: updatedAvailableSeats,
            bookedSeats: updatedBookedSeats,
            isFull: isFull,
          });

          await updateDoc(availableVehicleCollectionDocRef, {
            isAvailable: !isFull,
          });
          console.log(`Vehicle ${vehicleNumberPlate} has been updated seats`);
          return {
            success: true,
            message: `Vehicle ${vehicleNumberPlate} has been updated seats`,
          };
        } catch (error) {
          console.log("error trying to awairt vehicle update >> ", error);
          return {
            success: false,
            message: "error trying to awairt vehicle update >> ",
            error: error,
          };
        }
      }
    } catch (error) {
      console.error("Error updating seat numbers:", error);
      return {
        success: false,
        message: "Error updating seat numbers",
        error: error,
      };
    }
  };

  const fetchTripDetails = async (bookingTicketId) => {
    if (!bookingTicketId) {
    } else {
      const tripDetailRef = doc(db, "BookingCollection", bookingTicketId);
      const tripDetailSnap = await getDoc(tripDetailRef);
      if (tripDetailSnap.exists()) {
        console.log("Document data:", tripDetailSnap.data());
        return { success: true, data: tripDetailSnap.data() };
      } else {
        // tripDetailSnap.data() will be undefined in this case
        console.log("No such document!");
        return { success: false, data: "No such document!" };
      }
    }
  };

  const addTransactionToFirestore = async (transactionData) => {
    console.log("transactional Data >> ", transactionData);
    try {
      // const newTransactionColRef = doc(
      //   collection(db, "TransactionsCollection")
      // );
      // await setDoc(newTransactionColRef, transactionData);
      return {
        success: true,
        message: "successfully saved tranasaction",
        // transactionId: newTransactionColRef.id,
      };
    } catch (error) {
      console.error("Error registering new TRANSACTION:", error);
      throw error;
    }
  };

  // const fetchAvailableVehicle = async (selectedRideType) => {
  //   let subCollectionName = "";

  //   if (selectedRideType === "Mataxi Standard") {
  //     subCollectionName = "mataxiStandard";
  //   } else if (selectedRideType === "Mataxi XL") {
  //     subCollectionName = "mataxiXl";
  //   } else if (selectedRideType === "Mataxi Luxe") {
  //     subCollectionName = "mataxiLuxe";
  //   }

  //   if (subCollectionName) {
  //     console.log("selectedRideType for ref >>", subCollectionName);
  //     const availableVehicleCollectionRef = collection(
  //       db,
  //       "AvailableVehiclesCollection",
  //       subCollectionName,
  //       subCollectionName
  //     );
  //     const availableVehicleQuery = query(
  //       availableVehicleCollectionRef,
  //       where("isAvailable", "==", true)
  //     );

  //     const availableVehicleQuerySnapshot = await getDocs(
  //       availableVehicleQuery
  //     );

  //     if (availableVehicleQuerySnapshot?.empty) {
  //       return {
  //         success: false,
  //         data: null,
  //         message: `No vehicle exists in the selected Category >> ${selectedRideType}`,
  //       };
  //     } else {
  //       console.log(
  //         "availableVehicleQuerySnapShot from fetchVehicle >> ",
  //         availableVehicleQuerySnapshot
  //       );
  //       const vehicleData = availableVehicleQuerySnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

  //       return {
  //         success: true,
  //         data: vehicleData[0],
  //         message: "Vehicles exists in the selected category",
  //       };
  //     }
  //   } else {
  //     return {
  //       success: false,
  //       data: null,
  //       message: "selected category does not exist!",
  //     };
  //   }
  // };

  const fetchAvailableVehicle = async (selectedRideType) => {
    let subCollectionName = "";

    if (selectedRideType === "Mataxi Standard") {
      subCollectionName = "mataxiStandard";
    } else if (selectedRideType === "Mataxi XL") {
      subCollectionName = "mataxiXl";
    } else if (selectedRideType === "Mataxi Luxe") {
      subCollectionName = "mataxiLuxe";
    }

    if (subCollectionName) {
      let idx = 0; // Initialize index
      while (true) {
        const availableVehicleCollectionRef = collection(
          db,
          "AvailableVehiclesCollection",
          subCollectionName,
          subCollectionName
        );
        const availableVehicleQuery = query(
          availableVehicleCollectionRef,
          where("isAvailable", "==", true)
        );

        const availableVehicleQuerySnapshot = await getDocs(
          availableVehicleQuery
        );

        if (availableVehicleQuerySnapshot.empty) {
          return {
            success: false,
            data: null,
            message: `No vehicle exists in the selected Category >> ${selectedRideType}`,
          };
        } else {
          const vehicleData = availableVehicleQuerySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const vehicleId = vehicleData[idx].id;

          const bookingAllocationResponse =
            await checkIfVehicleExistsInTheBookingAllocationCollection(
              selectedRideType,
              vehicleId
            );

          if (
            !bookingAllocationResponse.success ||
            !bookingAllocationResponse.isFull
          ) {
            return {
              success: true,
              data: vehicleData[idx],
              isFull: bookingAllocationResponse.isFull,
              isAvailable: bookingAllocationResponse.isAvailable,
            };
          } else {
            idx++; // Increment index
            if (idx >= vehicleData.length) {
              return {
                success: false,
                data: null,
                message: `No available vehicle found in the selected Category >> ${selectedRideType}`,
              };
            }
          }
        }
      }
    } else {
      return {
        success: false,
        data: null,
        message: "selected category does not exist!",
      };
    }
  };

  const addVehicleToQueue = async (data, selectedRideType) => {
    console.log("Data received for adding vehicle to queue:", data);
    if (data) {
      let subCollectionName = "";

      if (selectedRideType === "MATAXI_STD") {
        subCollectionName = "mataxiStandard";
      } else if (selectedRideType === "MATAXI_XL") {
        subCollectionName = "mataxiXl";
      } else if (selectedRideType === "MATAXI_LUXE") {
        subCollectionName = "mataxiLuxe";
      }

      if (subCollectionName) {
        try {
          console.log(" selected  sub collection Name >> ", subCollectionName);
          const availableVehicleCollectionRef = doc(
            db,
            "AvailableVehicleCollection",
            subCollectionName,
            subCollectionName,
            data.id
          );
          const vehicleCollectionRef = doc(
            db,
            "VehicleCollection",
            subCollectionName,
            subCollectionName,
            data.id
          );

          const bookingAllocationCollectionRef = doc(
            db,
            "BookingAllocationCollection",
            subCollectionName,
            subCollectionName,
            data.id
          );

          const availableVehicleSnapShot = await getDoc(
            availableVehicleCollectionRef
          );

          const availableSeats = generateSeatNumbers(
            data.vehicleNumberPlate,
            data.seatCapacity
          );

          const bookingAllocationCollectionSnapshot = await getDoc(
            bookingAllocationCollectionRef
          );

          // Checking whether the vehicle is already added or not
          if (availableVehicleSnapShot.exists()) {
            console.log(
              "Vehicle exists in the Available Vehicle Collection:",
              availableVehicleSnapShot.data()
            );

            if (bookingAllocationCollectionSnapshot.exists()) {
              console.log(
                "Vehicle exists in the BookingAllocation Collection:",
                bookingAllocationCollectionSnapshot.data()
              );

              // at this point it exists in both collections

              await updateDoc(bookingAllocationCollectionRef, {
                isFull: false,
                availableSeats: availableSeats,
                bookedSeats: [],
              });

              await updateDoc(availableVehicleCollectionRef, {
                isAvailable: true,
              });

              await updateDoc(vehicleCollectionRef, {
                isAvailable: true,
                isFull: false,
              });

              return {
                success: true,
                message: "Vehicle made available successfully",
                data: availableVehicleSnapShot.data(),
              };
            } else {
              // if it only exists in the Available Vehicle collection and not in the bookingAllocationCollection
              console.log(
                "Vehicle does not exist in the BookingAllocation Collection"
              );
              console.log(
                "Creating vehicle in BookingAllocation Collection..."
              );

              const updatedData = {
                ...data,
                isFull: false,
              };

              const bookingAllocationCollectionDataToBeUsed = {
                ...updatedData,
                availableSeats: availableSeats,
                bookedSeats: [],
              };

              const createBookingAllocationCollectionResponse = await setDoc(
                bookingAllocationCollectionRef,
                bookingAllocationCollectionDataToBeUsed
              );
              console.log(
                "createBookingAllocationCollectionResponse  >> ",
                createBookingAllocationCollectionResponse
              );

              const updateAvailableVehicleCollectionResponse = await updateDoc(
                availableVehicleCollectionRef,
                {
                  isAvailable: true,
                }
              );
              await updateDoc(vehicleCollectionRef, {
                isAvailable: true,
                isFull: false,
              });

              // testing if this await updateDoc() actually returns a response
              console.log(
                "updateAvailableVehicleCollectionResponse  >> ",
                updateAvailableVehicleCollectionResponse
              );
              return {
                success: true,
                message: "Vehicle made available successfully",
                data: bookingAllocationCollectionDataToBeUsed,
              };
            }
          } else {
            // if availableVehicleSnapShot does not exists, create one
            console.log("Creating available vehicle document...");

            const newAvailableVehicleCollectionData = {
              vehicleId: data.id,
              vehicleNumberPlate: data.vehicleNumberPlate,
              isAvailable: true,
            };

            await setDoc(
              availableVehicleCollectionRef,
              newAvailableVehicleCollectionData
            );
            // check if vehicle exists in the bookingAllocation Collection
            if (bookingAllocationCollectionSnapshot.exists()) {
              console.log(
                "Vehicle exists in the BookingAllocation Collection:",
                bookingAllocationCollectionSnapshot.data()
              );

              // at this point , it doesnt exist in the  Available Vehicles collection but exists in the  Booking Allocation Collection

              await updateDoc(bookingAllocationCollectionRef, {
                isFull: false,
                availableSeats: availableSeats,
                bookedSeats: [],
              });

              return {
                success: true,
                message: "Vehicle made available successfully",
                data: availableVehicleSnapShot.data(),
              };
            } else {
              console.log(
                "Vehicle does not exist in the BookingAllocation Collection"
              );
              console.log(
                "Creating vehicle in BookingAllocation Collection..."
              );

              const updatedData = {
                ...data,
                isFull: false,
              };

              const bookingAllocationCollectionDataToBeUsed = {
                ...updatedData,
                availableSeats: availableSeats,
                bookedSeats: [],
              };

              const createBookingAllocationCollectionResponse = await setDoc(
                bookingAllocationCollectionRef,
                bookingAllocationCollectionDataToBeUsed
              );

              await updateDoc(vehicleCollectionRef, {
                isAvailable: true,
                isFull: false,
              });

              console.log(
                "createBookingAllocationCollectionResponse  >> ",
                createBookingAllocationCollectionResponse
              );

              return {
                success: true,
                message:
                  "Vehicle added to Booking Allocation Collection successfully",
                data: bookingAllocationCollectionDataToBeUsed,
              };
            }
          }
        } catch (err) {
          console.log("Error while adding vehicle to queue:", err);
          return {
            success: false,
            message: "Vehicle could not be made available",
            error: err,
          };
        }
      } else {
        console.log("subCollectionName is Undefined");
        return {
          success: false,
          message: "could not read <<subCollectionName>>",
        };
      }
    } else {
      console.log("Data is undefined");
      return {
        success: false,
        Data: null,
        message: "Data is undefined",
      };
    }
  };

  const removeVehicleFromQueue = async (data, selectedRideType) => {
    console.log("Removing vehicle from queue with ID:", data.id);
    if (data) {
      let subCollectionName = "";

      if (selectedRideType === "MATAXI_STD") {
        subCollectionName = "mataxiStandard";
      } else if (selectedRideType === "MATAXI_XL") {
        subCollectionName = "mataxiXl";
      } else if (selectedRideType === "MATAXI_LUXE") {
        subCollectionName = "mataxiLuxe";
      }

      if (subCollectionName) {
        try {
          const bookingAllocationCollectionRef = doc(
            db,
            "BookingAllocationCollection",
            subCollectionName,
            subCollectionName,
            data?.id
          );

          const bookingAllocationSnapshot = await getDoc(
            bookingAllocationCollectionRef
          );

          const availableVehicleCollectionRef = doc(
            db,
            "AvailableVehicleCollection",
            subCollectionName,
            subCollectionName,
            data.id
          );
          const vehicleCollectionRef = doc(
            db,
            "VehicleCollection",
            subCollectionName,
            subCollectionName,
            data.id
          );

          const availableVehicleSnapShot = await getDoc(
            availableVehicleCollectionRef
          );

          const bookingAllocationCollectionSnapshot = await getDoc(
            bookingAllocationCollectionRef
          );

          if (availableVehicleSnapShot.exists()) {
            console.log(
              "Vehicle exists in the Available Vehicle Collection:",
              availableVehicleSnapShot.data()
            );

            if (bookingAllocationCollectionSnapshot.exists()) {
              console.log(
                "Vehicle exists in the BookingAllocation Collection:",
                bookingAllocationCollectionSnapshot.data()
              );

              // at this point it exists in both collections

              await deleteDoc(bookingAllocationCollectionRef);

              await deleteDoc(availableVehicleCollectionRef);

              await updateDoc(vehicleCollectionRef, {
                isAvailable: false,
                isFull: false,
              });

              return {
                success: true,
                message: "Vehicle removed from queue successfully",
              };
            } else {
              // if it only exists in the Available Vehicle collection and not in the bookingAllocationCollection
              console.log(
                "Vehicle does not exist in the BookingAllocation Collection"
              );

              const updateAvailableVehicleCollectionResponse = await deleteDoc(
                availableVehicleCollectionRef
              );
              await updateDoc(vehicleCollectionRef, {
                isAvailable: false,
                isFull: false,
              });

              // testing if this await updateDoc() actually returns a response
              console.log(
                "updateAvailableVehicleCollectionResponse  >> ",
                updateAvailableVehicleCollectionResponse
              );
              return {
                success: true,
                message: "Vehicle removed from queue successfully",
              };
            }
          } else {
            // if availableVehicleSnapShot does not exists, 200 ok
            console.log("Creating available vehicle document...");

            // check if vehicle exists in the bookingAllocation Collection
            if (bookingAllocationCollectionSnapshot.exists()) {
              console.log(
                "Vehicle exists in the BookingAllocation Collection:",
                bookingAllocationCollectionSnapshot.data()
              );

              // at this point , it doesnt exist in the  Available Vehicles collection but exists in the  Booking Allocation Collection

              await deleteDoc(bookingAllocationCollectionRef);

              return {
                success: true,
                message: "Vehicle removed from queue successfully",
              };
            } else {
              console.log(
                "Vehicle does not exist in the BookingAllocation Collection"
              );

              await updateDoc(vehicleCollectionRef, {
                isAvailable: false,
                isFull: false,
              });

              return {
                success: true,
                message: "selected vehicle not found!",
              };
            }
          }
        } catch (err) {
          console.log("Error while removing vehicle from queue:", err);
          return {
            success: false,
            message: "Vehicle could not be removed from queue",
            error: err,
          };
        }
      } else {
        console.log("subCollectionName is undefined");
        return {
          success: false,
          message: "Could not read subCollectionName",
        };
      }
    } else {
      console.log("Vehicle ID is undefined");
      return {
        success: false,
        message: "Vehicle ID is undefined",
      };
    }
  };

  // const addVehicleToQueue = async (data, selectedRideType) => {
  //   console.log("data received for adding vehicle to queue >> ", data);
  //   let subCollectionName = "";

  //   if (selectedRideType === "MATAXI_STD") {
  //     subCollectionName = "mataxiStandard";
  //   } else if (selectedRideType === "MATAXI_XL") {
  //     subCollectionName = "mataxiXl";
  //   } else if (selectedRideType === "MATAXI_LUXE") {
  //     subCollectionName = "mataxiLuxe";
  //   }
  //   if (subCollectionName) {
  //     try {
  //       const availableVehicleCollectionRef = doc(
  //         db,
  //         "AvailableVehicleCollection",
  //         subCollectionName,
  //         subCollectionName,
  //         data?.id
  //       );

  //       const bookingAllocationCollectionRef = doc(
  //         db,
  //         "BookingAllocationCollection",
  //         subCollectionName,
  //         subCollectionName,
  //         data?.id
  //       );

  //       const availableVehicleSnapShot = await getDoc(
  //         availableVehicleCollectionRef
  //       );

  //       const availableSeats = generateSeatNumbers(
  //         data?.vehicleNumberPlate,
  //         data?.seatCapacity
  //       );

  //       const bookingAllocationCollectionSnapshot = await getDoc(
  //         bookingAllocationCollectionRef
  //       );

  //       //checking whether the vehicle is already added or not
  //       if (availableVehicleSnapShot.exists()) {
  //         console.log(
  //           "Vehicle Exists in the Available Vehicle  Collection :",
  //           availableVehicleSnapShot.data()
  //         );

  //         if (bookingAllocationCollectionSnapshot.exists()) {
  //           console.log(
  //             "Vehicle Exists in the BookingAllocation-Collection :",
  //             bookingAllocationCollectionSnapshot.data()
  //           );

  //           await updateDoc(bookingAllocationCollectionRef, {
  //             isFull: false,
  //             availableSeats: availableSeats,
  //             bookedSeats: [],
  //           })
  //           const availableVehicleUpdateResponse = await updateDoc(
  //             availableVehicleCollectionRef,
  //             {
  //               isAvailable: true,
  //             }
  //           );
  //         } else {
  //           console.log(
  //             "Vehicle Does Not Exists in the BookingAllocation-Collection "
  //           );
  //           console.log(
  //             "Creating Vehicle in BookingAllocation-Collection ... "
  //           );

  //           const bookingAllocationCollectionDataToBeUsed = {
  //             ...data,
  //             availableSeats: availableSeats,
  //             bookedSeats: [],
  //           };

  //           const addSelectedVehicleToBookingAllocationCollectionResponse =
  //             await setDoc(
  //               bookingAllocationCollectionRef,
  //               bookingAllocationCollectionDataToBeUsed
  //             );
  //           console.log(
  //             "addSelectedVehicleToBookingAllocationCollectionResponse >> ",
  //             addSelectedVehicleToBookingAllocationCollectionResponse
  //           );
  //         }

  //         return {
  //           success: true,
  //           message: "vehicle made Available Successfully",
  //           data: availableVehicleUpdateResponse,
  //         };
  //       } else {
  //         console.log("creating available vehilce Doc ...");
  //         const newAvailableVehicleCollectionData = {
  //           vehicleId: data.id,
  //           vehicleNumberPlate: data.vehicleNumberPlate,
  //           isAvailable: true,
  //         };

  //         const createNewAvailableVehicleResponse = await setDoc(
  //           availableVehicleCollectionRef,
  //           newAvailableVehicleCollectionData
  //         );

  //         return {
  //           success: true,
  //           message: "vehicle made Available Successfully",
  //           data: newAvailableVehicleCollectionData,
  //           response: createNewAvailableVehicleResponse,
  //         };
  //       }
  //     } catch (err) {
  //       console.log("Err while adding vehicle to queue >> ", err);
  //       return {
  //         success: false,
  //         message: "vehicle could not be made available",
  //         error: err,
  //       };
  //     }
  //   }
  // };

  const fetchSelectedAvailableVehicleData = async (
    selectedRideType,
    vehicleId
  ) => {
    let subCollectionName = "";

    if (selectedRideType === "Mataxi Standard") {
      subCollectionName = "mataxiStandard";
    } else if (selectedRideType === "Mataxi XL") {
      subCollectionName = "mataxiXl";
    } else if (selectedRideType === "Mataxi Luxe") {
      subCollectionName = "mataxiLuxe";
    }

    if (subCollectionName && vehicleId) {
      console.log("selectedRideType for ref >>", subCollectionName);
      console.log("vehicleId for ref >>", vehicleId);

      let bookedVehicleSnapshot;
      // Query to check if the vehicle exists
      try {
        const bookedVehicleDocRef = doc(
          db,
          "BookingAllocationCollection",
          subCollectionName,
          subCollectionName,
          vehicleId
        );

        bookedVehicleSnapshot = await getDoc(bookedVehicleDocRef);
      } catch (error) {
        console.log("bookedVehicleDocRef dont work >> ", error);
      }
      if (bookedVehicleSnapshot?.exists()) {
        const bookedVehicleData = bookedVehicleSnapshot?.data();
        console.log("bookedVehicleData >> ", bookedVehicleData);

        return {
          success: true,
          data: bookedVehicleData,
        };
      } else {
        return { success: false, error: "Vehicle not found" };
      }
    }
  };

  return {
    approvedRoutes,
    mataxiStandard,
    mataxiXl,
    mataxiLuxe,
    addVehicleToQueue,
    removeVehicleFromQueue,
    fetchAllMataxis,
    fetchAllVehiclesInCollection,
    fetchSaccos,
    fetchAllSaccoMataxis,
    registerNewRoute,
    registerNewBooking,
    getSelectedRoute,
    fetchSelectedVehicleDetails,
    fetchAvailableVehicle,
    fetchTripDetails,
    addTransactionToFirestore,
    updateBookingPaidStatus,
    updateSeatNumberBooking,
    fetchSelectedAvailableVehicleData,
    checkIfVehicleExistsInTheBookingAllocationCollection,
    addSelectedVehicleToBookingAllocationCollection,
  };
};
