import java.io.File

//todd solution
fun main() {
    val d = Day01(File("../inputs/day01.txt").readLines())
    println(d.solvePart1())
    println(d.solvePart2())
}

class Day01(private val input: List<String>) {
    private val words: Map<String, Int> = mapOf(
        "one" to 1,
        "two" to 2,
        "three" to 3,
        "four" to 4,
        "five" to 5,
        "six" to 6,
        "seven" to 7,
        "eight" to 8,
        "nine" to 9
    )

    fun testPart2() = "four82nine74".possibleWordsAt(1)

    //adds all number values from `calibrationValue(it)`
    fun solvePart1(): Int = input.sumOf { calibrationValue(it) }

    //adds all number values in resulting list
    fun solvePart2(): Int = input.sumOf { row: String ->
        calibrationValue(
            //run through each char and turn into a digit or a null
            //and then map each of them to a string. in theory, we could
            //take the first and last digits from the resulting list instead of joining
            row.mapIndexedNotNull { index: Int, c ->
                //if digit, take as is
                if (c.isDigit()) c
                else
                //otherwise, see if this is the start of a word and if so
                //map to the digit that it represents.
                    row.possibleWordsAt(index).firstNotNullOfOrNull { candidate -> words[candidate] }
           //creates a list of strings separated by `,`
            }.joinToString()
        )
    }

    //check for the first and last instance of a digit character
    //concatenate them as strings
    //return them as numbers
    private fun calibrationValue(row: String): Int = "${row.first { it.isDigit() }}${row.last { it.isDigit() }}".toInt()

    //takes an integer as the starting point representing the index of the string
    //returns a list of 3 values
    //the values are substrings of the parsed string returning at most 3, 4 and 5 chars respectively
    private fun String.possibleWordsAt(startingAt: Int): List<String> = (3..5).map { len: Int ->
        substring(startingAt, (startingAt + len).coerceAtMost(length))
    }
}

// seb solution
//val words = listOf("one", "two", "three", "four", "five", "six", "seven", "eight", "nine")
//val revWords = words.map { it.reversed() }
//fun main() {
//    part1()
//    part2()
//}
//
//fun part1() {
//    val lines = readInput("day01")
//    println(lines.sumOf { line: String -> line.first { it.isDigit() }.digitToInt() * 10 + line.last { it.isDigit() }.digitToInt() })
//}
//
//fun part2() {
//    val lines = readInput("day01")
//    println(lines.sumOf { line -> getNumber(line, StartFrom.BEGINNING) * 10 + getNumber(line, StartFrom.END) })
//}
//
//enum class StartFrom { BEGINNING, END }
//
//private fun getNumber(line: String, startFrom: StartFrom): Int {
//    val indices = when (startFrom) {
//        StartFrom.BEGINNING -> line.indices
//        StartFrom.END -> line.lastIndex downTo 0
//    }
//    for (idx in indices) {
//        line[idx].digitToIntOrNull()?.let { return it }
//        for ((wordIndex, word) in words.withIndex()) {
//            if (line.substring(idx).startsWith(word)) {
//                return (wordIndex + 1)
//            }
//        }
//    }
//    error("Unreachable")
//}
