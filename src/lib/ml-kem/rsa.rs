fn rsa(message: String) -> String {
    let mut results: String = "".to_owned();
    // timestamps for total_time and stopwatch
    let total_time = Instant::now();
    let mut stopwatch = Instant::now();

    // instance of random number generator
    let mut rng = rand::thread_rng();

    // set bit size (therefore key size will be 256 bytes)
    let bits = 2048;

    // generate private and public keys
    let priv_key = RsaPrivateKey::new(&mut rng, bits).expect("failed to generate a key");
    let pub_key = RsaPublicKey::from(&priv_key);
    results.push_str(&format!("Key generation time - {:?}\n", stopwatch.elapsed()));
    stopwatch = Instant::now();

    // encrypt message
    let data = message.as_bytes();
    let enc_data = pub_key.encrypt(&mut rng, Pkcs1v15Encrypt, &data[..]).expect("failed to encrypt");
    results.push_str(&format!("Encryption time - {:?}\n", stopwatch.elapsed()));
    stopwatch = Instant::now();

    // decrypt message
    let dec_data = priv_key.decrypt(Pkcs1v15Encrypt, &enc_data).expect("failed to decrypt");
    results.push_str(&format!("Decryption time - {:?}\n", stopwatch.elapsed()));

    // verify initial message and decrypted message are the same
    assert_eq!(&data[..], &dec_data[..]);
    results.push_str(&format!("Total time - {:?}\n", total_time.elapsed()));

    results
}
