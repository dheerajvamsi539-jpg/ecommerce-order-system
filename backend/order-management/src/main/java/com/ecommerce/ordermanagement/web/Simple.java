package com.ecommerce.ordermanagement.web;
import java.util.stream.IntStream;
public class Simple {
    public static void main(String[] args) {
        String str = " this is hyderabad City";
         String Longest = IntStream.range(0, str.length())
                .mapToObj(i -> str.substring(i))
                .map(Simple::FUP)
                .max((a,b) -> Integer.compare(a.length(),b.length()))
                .orElse("");
         System.out.println("Longest String: "+Longest);
    }

    private static String FUP(String x){
        StringBuilder y =new StringBuilder();
        for( char a : x.toCharArray()){
            if(y.toString().contains(String.valueOf(a)))
                break;
        }
        return y.toString();
    }
}
