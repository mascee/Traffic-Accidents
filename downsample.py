# Downsample US_Accidents_March23.csv to 1%

TARGET_PERCENT = 1

with open("data/US_Accidents_March23.csv", "r") as input:
    with open(f"data/US_Accidents_March23_{TARGET_PERCENT}_percent.csv", "w") as output:
        line_number = 0

        while True:
            line = input.readline()

            if not line:
                break

            if line_number % 100 < TARGET_PERCENT:
                output.write(line)
            
            line_number += 1