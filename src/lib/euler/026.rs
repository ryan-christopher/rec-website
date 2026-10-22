fn longest_recurring_cycle (val: f64) {
    let mut d = 2;
    for x in 2..val as i32 {
        let fraction: f64 = 1.0 / x as f64;
        println!("x: {}, {:.}", x, fraction);
    }
}

fn main() {
    let start = std::time::Instant::now();
    longest_recurring_cycle(1000 as f64);
    println!("Elapsed: {:?}", start.elapsed());
}
