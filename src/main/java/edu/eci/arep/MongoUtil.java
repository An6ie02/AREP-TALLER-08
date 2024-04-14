package edu.eci.arep;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

public class MongoUtil {
    private static final String CONNECTION_STRING = "mongodb://ec2-44-201-174-153.compute-1.amazonaws.com:27017";
    private static final String DATABASE = "quarkustwitter";

    public static MongoDatabase getMongoDB() {
        MongoClient mongoClient = MongoClients.create(CONNECTION_STRING);
        return mongoClient.getDatabase(DATABASE);
    }

}