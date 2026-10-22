fn sum_square_diff(num: i32) -> i32 {
    let mut sum_of_squares = 0;
    let mut square_of_sum = 0;
    for x in 1..=num {
        sum_of_squares += x.pow(2);
        square_of_sum += x;
    }
    square_of_sum = square_of_sum.pow(2);
    square_of_sum - sum_of_squares
}