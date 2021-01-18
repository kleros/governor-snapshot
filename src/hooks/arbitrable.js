const readFile = (file) => {
  return new Promise(resolve => {
    let request = new XMLHttpRequest()
    request.open('GET', file, true)
    request.responseType = 'blob'
    request.onload = () => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(new Buffer(reader.result))
      }
      reader.readAsArrayBuffer(request.response)
    }
    request.send()
  })
}

/**
 * Send file to IPFS network via the Kleros IPFS node
 * @param {string} fileName - The name that will be used to store the file. This is useful to preserve extension type.
 * @param {ArrayBuffer} data - The raw data from the file to upload.
 * @return {object} ipfs response. Should include the hash and path of the stored item.
 */
const ipfsPublish = async (fileName, data) => {
  const buffer = await Buffer.from(data)

  return new Promise((resolve, reject) => {
    fetch('https://ipfs.kleros.io/add', {
      method: 'POST',
      body: JSON.stringify({
        fileName,
        buffer
      }),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(success => resolve(success.data))
      .catch(err => reject(err))
  })
}

export const submitEvidence = async (governorContractInstance, _evidence, account) => {
  let fileURI

  if (_evidence.file) {
    const data = await readFile(_evidence.file.dataURL)

    // Upload the meta-evidence then return an ipfs hash
    const fileIpfsHash = await ipfsPublish(
      ipfsPublish,
      _evidence.file.name,
      data
    )

    fileURI = `/ipfs/${fileIpfsHash[1].hash}${fileIpfsHash[0].path}`
  }

  // Pass IPFS path for URI. No need for fileHash
  const evidence = {
    fileURI,
    name: _evidence.name,
    description: _evidence.description
  }

  const enc = new TextEncoder()

  const fileIpfsHash = await ipfsPublish(
    'evidence.json',
    enc.encode(JSON.stringify(evidence))
  )

  const evidenceFileURI = `/ipfs/${fileIpfsHash[1].hash}${fileIpfsHash[0].path}`
  await governorContractInstance.methods.submitEvidence(evidenceFileURI).send({
    from: account
  })
}
