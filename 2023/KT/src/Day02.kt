//artem solution
import kotlin.math.max

fun main() {
    //2 data classes: one for the game id, another for the balls selections
    data class Set(val red: Int, val green: Int, val blue: Int)
    data class Game(val id: Int, val sets: List<Set>)

    //    println("Game (\\d+)".toRegex().find("Game 11")!!.groupValues[2])
//parse each line into the appropriate Game and Set data class
    fun parse(input: List<String>) = input.map {
        val (game: String, sets: String) = it.split(":")
        //regex function separates the number as the id
        val id = "Game (\\d+)".toRegex().find(game)!!.groupValues[1].toInt()
        //regex function separates number of red, green and blue balls (where available) into Set data class
        sets.split(";").map {
            val red = "(\\d+) red".toRegex().find(it)?.groupValues?.get(1)?.toInt() ?: 0
            val green = "(\\d+) green".toRegex().find(it)?.groupValues?.get(1)?.toInt() ?: 0
            val blue = "(\\d+) blue".toRegex().find(it)?.groupValues?.get(1)?.toInt() ?: 0
            //creates Set data class with returned numbers for red, green and blue.
            //there can be multiple sets per instance of game played(separated by ;)
            Set(red, green, blue)
        }.let {
            //creates Game data class with each returned set and id
            Game(id, it)
        }
    }

    fun part1(input: List<String>): Int {
        val expectedRed = 12;
        val expectedGreen = 13;
        val expectedBlue = 14
        //filter any game out that has more than the expected number of red, green or blue balls
        return parse(input).filter {
            it.sets.none { it.red > expectedRed || it.green > expectedGreen || it.blue > expectedBlue }
            //adds the id of the games that remain
        }.sumOf { it.id }
    }

    //PART1 SOLUTION
    println(part1(readInput("day02")))

    //from our data classes, run through each round in a game (separated by ;),
    // and find the highest number of each color available
    fun part2(input: List<String>): Int {
        return parse(input).map {
            var maxRed = 0
            var maxGreen = 0
            var maxBlue = 0
            it.sets.forEach {
                maxRed = max(maxRed, it.red)
                maxGreen = max(maxGreen, it.green)
                maxBlue = max(maxBlue, it.blue)
            }
            //return product of max values
            maxRed * maxGreen * maxBlue
            //then add the products
        }.sumOf { it }
    }

    println(part2(readInput("day02")))

    //test if implementation meets criteria from the description, like:
    val testInput = readInput("day02_test")
    check(part1(testInput) == 8)
    check(part2(testInput) == 2286)

}

//seb solution
//import java.io.File
//
//val lines = File("src/day02.txt").readLines()
//
//val games = lines.map { Game(it) }
//
//fun main() {
//    println(part1())
//    println(part2())
//}
//
//fun part1(): Int {
//    //12 red cubes, 13 green cubes and 14 blue cubes
//    val availableReds = 12
//    val availableGreens = 13
//    val availableBlues = 14
//
//    val idSum = games.filter { it.isPossible(availableReds, availableGreens, availableBlues) }.sumOf { it.gameId }
//    return idSum
//}
//
//fun part2(): Int {
//    val totalPower = games.sumOf { it.power }
//    return totalPower
//}
//
////---
//enum class Color(val text: String) {
//    RED("red"),
//    GREEN("green"),
//    BLUE("blue")
//}
//
//data class CubeSet(
//        val red: Int,
//        val green: Int,
//        val blue: Int
//)
//
//fun CubeSet(string: String): CubeSet {
//    val individualCubes = string.split(", ").associate { numberToColorText: String ->
//        val (countStr, colorName) = numberToColorText.split(" ")
//        val color = Color.entries.first { it.text == colorName }
//        val count = countStr.toInt()
//        color to count
//    }
//    return CubeSet(
//            individualCubes[Color.RED] ?: 0,
//            individualCubes[Color.GREEN] ?: 0,
//            individualCubes[Color.BLUE] ?: 0
//    )
//}
//
//data class Game(
//        val gameId: Int,
//        val moveSet: List<CubeSet>
//)
//
//val Game.power: Int //property or function? :)
//    get() {
//        //"required" rather than "minimum"
//        val requiredReds = moveSet.maxOf { it.red }
//        val requiredGreens = moveSet.maxOf { it.green }
//        val requiredBlues = moveSet.maxOf { it.blue }
//        return requiredReds * requiredGreens * requiredBlues
//    }
//
//fun Game.isPossible(availableReds: Int, availableGreens: Int, availableBlues: Int): Boolean {
//    return moveSet.all {
//        it.red <= availableReds && it.green <= availableGreens && it.blue <= availableBlues
//    }
//}
//
//fun Game(line: String): Game {
//    val gameId = line.removePrefix("Game ").takeWhile { it.isDigit() }.toInt()
//    val allVisibleCubesText = line.dropWhile { it != ':' }.removePrefix(": ")
////    val allVisibleCubesText = line.removeRegexPrefix("""Game \d+: """.toRegex())
//
//    val cubeSets = allVisibleCubesText.split(";").map { CubeSet(it.trim()) }
//    return Game(gameId, cubeSets)
//}
//
//fun String.removeRegexPrefix(re: Regex): String {
//    val match = re.find(this) ?: return this
//    return if (match.range.first == 0) this.removeRange(match.range) else this
//}