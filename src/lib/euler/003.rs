// start at the maximum possible prime number, then work
// down until the first prime is found
fn largest_prime(num: i64) -> i64 {
    let mut val = (num as f64).sqrt().ceil() as i64 + 1;
    while val > 0 {
        if (num % val) == 0 {
            if is_prime(val) {
                return val
            }
        }
        val -= 1;
    }
    1
}

// function to determine if number is prime
fn is_prime(n: i64) -> bool {
    if n % 2 == 0 {
        return false;
    }
    if n == 3 {
        return true;
    }
    let mut search_val = 3;
    let max_val = ((n as f64).sqrt().ceil() as i64) + 1;
    while search_val <= max_val {
        if n % search_val == 0 {
            return false
        }
        search_val += 2;
    }
    return true;
}
