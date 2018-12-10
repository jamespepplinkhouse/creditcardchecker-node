use luhn2::validate;
use rayon::prelude::*;
use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader, Write};

fn main() {
    let args: Vec<String> = env::args().collect();
    let input_file_arg = &args[1];
    let output_file_arg = &args[2];

    let input_file = File::open(input_file_arg)
        .expect(&format!("Cannot open the input file: {}", input_file_arg));

    let cards: Vec<String> = BufReader::new(input_file)
        .lines()
        .filter_map(|result| result.ok())
        .collect();

    let results: Vec<String> = cards
        .par_iter()
        .map(|card| {
            let validity = match validate(card.parse::<u64>().unwrap()) {
                false => "invalid",
                true => "valid",
            };

            format!("MasterCard: {} ({})", card, validity)
        })
        .collect();

    let mut output = File::create(output_file_arg)
        .expect(&format!("Cannot create output file: {}", output_file_arg));

    write!(output, "{}\n", results.join("\n"))
        .expect(&format!("Cannot wrtie output file: {}", output_file_arg));
    ()
}
