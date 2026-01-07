package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/Zaccal/smart-docs/handlers"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	PORT := os.Getenv("PORT")

	router := gin.Default()

	err := router.SetTrustedProxies([]string{
		"127.0.0.1",
		"::1",
	})

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	if err != nil {
		panic(err)
	}

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	router.POST("/excel/additianl-options-invoice", handlers.AdditianlOptionsInvoice)

	router.Run()

	fmt.Printf("The server runing on port: %v", PORT)
}
