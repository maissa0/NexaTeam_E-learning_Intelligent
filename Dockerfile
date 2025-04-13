FROM openjdk:17
EXPOSE 8088
ADD target/payment-management-0.0.1-SNAPSHOT.jar payment-management.jar
ENTRYPOINT ["java","-jar" , "payment-management.jar"]