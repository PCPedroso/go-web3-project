package utils

import (
	"encoding/hex"
	"regexp"
)

// ValidateAddress checks if the provided address is a valid Ethereum address.
func ValidateAddress(address string) bool {
	re := regexp.MustCompile("^0x[a-fA-F0-9]{40}$")
	return re.MatchString(address)
}

// ConvertToHex converts a byte array to a hexadecimal string.
func ConvertToHex(data []byte) string {
	return hex.EncodeToString(data)
}