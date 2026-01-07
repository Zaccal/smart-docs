package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
)

const sheetName = "TDSheet"

type Options struct {
	Label string `json:"label" binding:"required"`
	Value string `json:"value" binding:"required"`
}

func AdditianlOptionsInvoice(ctx *gin.Context) {
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "No file provided"})
		return
	}

	openedFile, err := file.Open()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Cannot open file"})
		return
	}
	defer openedFile.Close()

	excelFile, err := excelize.OpenReader(openedFile)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Excel file"})
		return
	}

	optionsStr := ctx.PostForm("options")
	if optionsStr == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Options is required"})
		return
	}

	var options []Options
	if err := json.Unmarshal([]byte(optionsStr), &options); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid options format"})
		return
	}

	borderStyle, err := excelFile.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "top", Color: "000000", Style: 1},
			{Type: "bottom", Color: "000000", Style: 1},
			{Type: "right", Color: "000000", Style: 2},
			{Type: "left", Color: "000000", Style: 2},
		},
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't create border style"})
		return
	}

	rowIndex := 22
	for i, op := range options {

		if i > 0 {
			if err := excelFile.DuplicateRow(sheetName, rowIndex); err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't duplicate row"})
				return
			}
		}

		rowIndex++

		startCell := "A" + strconv.Itoa(rowIndex)
		endCell := "K" + strconv.Itoa(rowIndex)

		if err := excelFile.SetCellRichText(sheetName, startCell, []excelize.RichTextRun{
			{
				Text: op.Label + ": ",
				Font: &excelize.Font{Bold: true, Family: "Arial", Size: 8},
			},
			{
				Text: op.Value,
				Font: &excelize.Font{Family: "Arial", Size: 8},
			},
		}); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't set value"})
			return
		}

		if err := excelFile.MergeCell(sheetName, startCell, endCell); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't merge cells"})
			return
		}

		if err := excelFile.SetCellStyle(sheetName, startCell, endCell, borderStyle); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't set border"})
			return
		}
	}

	if err := excelFile.DuplicateRow(sheetName, rowIndex); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't duplicate last row"})
		return
	}

	rowIndex++

	startCell := "A" + strconv.Itoa(rowIndex)
	endCell := "K" + strconv.Itoa(rowIndex)

	if err := excelFile.SetCellValue(sheetName, startCell, ""); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't set last row"})
		return
	}

	excelFile.MergeCell(sheetName, startCell, endCell)
	excelFile.SetCellStyle(sheetName, startCell, endCell, borderStyle)

	buf := new(bytes.Buffer)

	if err := excelFile.Write(buf); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate Excel"})
		return
	}

	ctx.Header("Content-Disposition", "attachment; filename="+file.Filename)
	ctx.Data(http.StatusOK, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", buf.Bytes())
}
