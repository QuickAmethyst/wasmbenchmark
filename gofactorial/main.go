package main

import (
	"syscall/js"
)

func factorialIterative(x int) int {
	var result = 1

	if x >= 0 {
		for i := 1; i <= x; i++ {
			result *= i
		}
	}

	return result
}

func factorialRecursive(x int) int {
	if x == 0 {
		return 1
	}

	return x * factorialRecursive(x - 1)
}

func factorialRecursiveInterface(this js.Value, inputs []js.Value) interface{} {
	return factorialRecursive(inputs[0].Int())
}

func factorialIterativeInterface(this js.Value, inputs []js.Value) interface{} {
	return factorialIterative(inputs[0].Int())
}

func main() {
	c := make(chan int)
	js.Global().Set("factorialRecursive", js.FuncOf(factorialRecursiveInterface))
	js.Global().Set("factorialIterative", js.FuncOf(factorialIterativeInterface))
	<-c
}