fn digit_powers(pow_digit: u32) -> i32 {
    let mut stored_powers: Vec<i32> = Vec::new();
    for i in 0..=9 {
        stored_powers.push((i as i32).pow(pow_digit));
    }
    let (mut power_sum, mut val, mut max_digits) = (0, 2, 1);
    let mut max_digit_val = 9_i32.pow(pow_digit);
    while 10_i32.pow(max_digits) < max_digit_val {
        max_digits += 1;
        max_digit_val = max_digit_val + 9_i32.pow(pow_digit);
    }
    while val <= max_digit_val {
        let (mut candidate_val, mut candidate_sum) = (val.clone(), 0);
        while candidate_val > 0 {
            let current_digit: i32 = candidate_val % 10;
            candidate_sum += stored_powers[(current_digit) as usize];
            candidate_val = candidate_val / 10;
        }
        if candidate_sum == val {
            power_sum += val;
        }       
        val += 1;
    }
    power_sum
}