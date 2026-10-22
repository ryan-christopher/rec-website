fn find_lexicographic_permutation(mut digits: Vec::<usize>, mut p_target: usize) -> usize {
    let mut permutation = String::from("");
    p_target -= 1;
    for _x in 1..digits.len() {
        let digit = p_target / factorial(digits.len() - 1);
        permutation = format!("{}{}", &permutation, digits[digit]);
        digits.remove(digit);
        p_target %= factorial(digits.len());
    }
    if digits == [0] {
        permutation = format!("{}{}", &permutation, 0);
    }
    permutation.parse::<usize>().unwrap()
}

fn factorial(val: usize) -> usize {
    let mut product = 1;
    for x in 1..=val {
        product *= x;
    }
    product
}