fn kyber(message: String) -> String {
    let mut results: String = "".to_owned();
    // timestamps for total_time and stopwatch
    let total_time = Instant::now();
    let mut stopwatch = Instant::now();

    // instance of random number generator
    let mut rng = rand::thread_rng();

    // encapsulate = public key, decapsulate = private key
    let (dk, ek) = MlKem768::generate(&mut rng);
    results.push_str(&format!("Key generation time - {:?}\n", stopwatch.elapsed()));
    stopwatch = Instant::now();

    // encapsulate shared key to the holder of the decapsulation key, receive the shared secret 'k_send'
    // and the encapsulated form 'ct'
    let (ct, k_send) = ek.encapsulate(&mut rng).unwrap();
    results.push_str(&format!("Encapsulation time - {:?}\n", stopwatch.elapsed()));
    stopwatch = Instant::now();

    // decapsulate the shared key
    let k_recv = dk.decapsulate(&ct).unwrap();
    results.push_str(&format!("Decapsulation time - {:?}\n", stopwatch.elapsed()));

    // verify shared keys are identical
    assert_eq!(k_send, k_recv);
    stopwatch = Instant::now();

    // take symmetric key generated from kyber, pass as GenericArray
    let key = Key::<Aes256Gcm>::from_slice(&k_send);

    // create cipher from key
    let cipher = Aes256Gcm::new(&key);
    results.push_str(&format!("Key and cipher generation time - {:?}\n", stopwatch.elapsed()));
    stopwatch = Instant::now();

    // initialize nonce/IV to be used in combination with encryption key
    let nonce = Aes256Gcm::generate_nonce(&mut OsRng);

    // encrypt message
    let ciphertext = cipher.encrypt(&nonce, message.as_bytes().as_ref()).unwrap();
    results.push_str(&format!("Encryption time - {:?}\n", stopwatch.elapsed()));
    stopwatch = Instant::now();

    // decrypt message
    let plaintext = cipher.decrypt(&nonce, ciphertext.as_ref()).unwrap();
    results.push_str(&format!("Decryption time - {:?}\n", stopwatch.elapsed()));

    // verify initial message and decrypted message are the same
    assert_eq!(&plaintext, message.as_bytes());
    results.push_str(&format!("Total time - {:?}\n", total_time.elapsed()));

    results
}
