fn main() {
    let mut multiples_sum = 0;
    for i in 0..1000 {
        if i % 3 == 0 || i % 5 == 0 {
            multiples_sum += i;
        }
    }
}