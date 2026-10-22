fn get_even_fib_sum(max_val: i32) -> i32 {
    let mut even_sum = 2;
    let mut sequence = [1, 2, 3];
    while sequence[2] < max_val {
        sequence = [sequence[1], sequence[2], sequence[1] + sequence[2]];
        if sequence[2] % 2 == 0 {
            even_sum += sequence[2];
        }
    }
    even_sum
}