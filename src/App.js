import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import ipfs from './ipfs'
import Greeter from './artifacts/contracts/Certification.sol/Certification.json'
import CreateCertificateForm from './components/CreateCertificateForm'

const greeterAddress = '0x9412aCA3F016138CDd91abE2addD6c9546D84177'

function App() {
  const [title, setTitle] = useState()
  const [artist, setArtist] = useState()
  const [year, setYear] = useState()
  const [image, setImage] = useState()
  const [message, setMessage] = useState()
  const [buffer, setBuffer] = useState()
  const [ipfsHash, setIpfsHash] = useState()
  const [certificates, setCertificates] = useState()
  const [showForm, setShowForm] = useState()
  const [showEditForm, setShowEditForm] = useState()

  const titleChangeHandler = (selectedTitle) => {
    setTitle(selectedTitle);
  }

  const artistChangeHandler = (selectedArtist) => {
    setArtist(selectedArtist);
  }

  const yearChangeHandler = (selectedYear) => {
    setYear(selectedYear);
  }

  const messageChangeHandler = (selectedMessage) => {
    setMessage(selectedMessage);
  }

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  function cleanCertState() {
    setTitle()
    setArtist()
    setYear()
    setImage()
    setIpfsHash()
    setShowEditForm()
    setBuffer()
  }

  async function createCertificate() {
    if (typeof window.ethereum !== 'undefined') {
      const addedFile = await ipfs.add(buffer)

      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)

      setMessage('Waiting on transaction success...')
      const transaction = await contract.createCertificate(title, artist, year, addedFile.cid.toV1().toString())
      await transaction.wait()
      setShowForm(!showForm)
      setMessage('transaction completed')

      cleanCertState();
    }
  }

    async function fetchCertificate() {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
        try {
          const data = await contract.getCertificates()
          setCertificates(data)
          console.log('data: ', data)
        } catch (err) {
          console.log("Error: ", err)
        }
      }
    }

    function captureFile(event) {
      const file = event.target.files[0]

      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
        setBuffer(Buffer(reader.result))
      }
    }


    async function saveCertificate(index, owner, imageHash) {
      if (typeof window.ethereum !== 'undefined') {
        let addedFile
        if (buffer) {
          addedFile = await ipfs.add(buffer)
          addedFile = addedFile.cid.toV1().toString()
        } else {
          addedFile = imageHash
        }
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)

        setMessage('Waiting on transaction success...')
        const transaction = await contract.editCertificate(index, owner, title, artist, year, addedFile)
        await transaction.wait()
        setMessage('transaction completed')

        cleanCertState()
      }
    }

    function editCertificate(titleArg, artistArg, yearArg, imageHash, index) {
      setTitle(titleArg)
      setArtist(artistArg)
      setYear(yearArg)
      setIpfsHash(imageHash)
      setShowEditForm(index)
    }


  return (
    <div className="App">
        <h2>Certification</h2>
        <hr />
        <div className="DivContainer">
          <div className="FStart">
            <button onClick={() => setShowForm(!showForm)}>Create Certificate</button>
          </div>
          { showForm && <div className="DivColumn">
          <CreateCertificateForm
            title={title}
            artist={artist}
            year={year}
            onSetTitle={titleChangeHandler}
            onSetArtist={artistChangeHandler}
            onSetYear={yearChangeHandler}
            onSetImage={captureFile}
          />
          <div className="DivColumn">
            <div className="FStart">
              <button onClick={createCertificate}>Add Certificate</button>
            </div>
          </div>
          <h2>{message}</h2>
        </div>}
        <hr />
        <hr />
        <h2>List Certificates</h2>
        <hr />
        <div className="FStart">
          <button onClick={fetchCertificate}>Fetch Certificates</button>
        </div>
        <ul className='expenses-list'>
        {certificates && certificates.map((expense) => (
          <li key={expense.index}>
          <div className="DivRow">
            <div>
              <img src={'https://' + expense.image + '.ipfs.dweb.link/'}/>
            </div>
            <div className="CertificateInfo">
            <div>Title: {expense.title}</div>
            <div>Artist: {expense.artist}</div>
            <div>Year: {parseInt(expense.year._hex, 16)}</div>
            </div>
            </div>

            <button className="FStart" onClick={e =>
              editCertificate(expense.title, expense.artist, expense.year, expense.image, parseInt(expense.index._hex, 16))}>Edit certificate</button>
            { (showEditForm === parseInt(expense.index._hex, 16) )  &&
            <div className="DivColumn">
            <CreateCertificateForm
              title={title}
              artist={artist}
              year={year}
              onSetTitle={titleChangeHandler}
              onSetArtist={artistChangeHandler}
              onSetYear={yearChangeHandler}
              onSetImage={captureFile}
            />
              <div className="Buttons">
                <button onClick={() => saveCertificate(expense.index, expense.owner, parseInt(expense.index._hex, 16))}>Save Changes</button>
                <button onClick={() => cleanCertState()}>Stop Editing</button>
              </div>
              <h2>{message}</h2>
            </div> }
            <hr />
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}

export default App;
