// div_by_all takes num as input and finds the smallest positive number that is
// evenly divisible by all numbers from 1 to num
fn div_by_all(num: i64) -> i64 {
    // set value equal to max number to be divided by
    let mut test_val = num;
    // begin loop to check for each value of test_val, increment by num each loop
    loop {
        for i in 2..=num {
            if test_val % i != 0 {
                break;
            }
            // if all numbers are checked, the number has been found
            else if i == num {
                return test_val;
            }
        }
        test_val += num;
    }
}