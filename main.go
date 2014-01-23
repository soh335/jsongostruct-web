package main

import (
	"bytes"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/soh335/jsongostruct/converter"
	"log"
	"net/http"
	"os"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		http.ServeFile(res, req, "./static/index.html")
	}).Methods("GET")
	r.HandleFunc("/", errorHandler(postHandler)).Methods("POST")
	r.PathPrefix("/{css|js}").Handler(http.FileServer(http.Dir("./static/")))
	http.Handle("/", r)
	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), nil))
}

func errorHandler(handler func(res http.ResponseWriter, req *http.Request) error) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		err := handler(res, req)
		if err == nil {
			return
		}
		switch err {
		default:
			http.Error(res, "oops", http.StatusInternalServerError)
		}
	}
}

type PostData struct {
	Name string
	Json json.RawMessage
}

func postHandler(res http.ResponseWriter, req *http.Request) error {
	defer req.Body.Close()
	dec := json.NewDecoder(req.Body)
	var postData PostData
	if err := dec.Decode(&postData); err == nil {
		return converter.JsonGoStruct(bytes.NewReader(postData.Json), res, postData.Name)
	} else {
		return err
	}
}
