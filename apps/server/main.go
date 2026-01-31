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
	if PORT == "" {
		PORT = "8080"
	}

	router := gin.Default()

	err := router.SetTrustedProxies(nil)
	if err != nil {
		panic(err)
	}

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

	api := router.Group("/api")
	{
		api.GET("/ping", func(ctx *gin.Context) {
			ctx.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})

		api.POST("/invoice/set-options-invoice", handlers.SetAdditionalOptionsInvoice)
	}

	fmt.Printf("The server is running on port: %v\n", PORT)
	router.Run(":" + PORT)
}
