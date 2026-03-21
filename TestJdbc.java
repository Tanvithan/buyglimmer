import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class TestJdbc {
    public static void main(String[] args) {
        String url = "jdbc:mariadb://34.47.168.236:7306/sabbpeapparels?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Kolkata&tcpKeepAlive=true&connectTimeout=5000&socketTimeout=10000";
        String user = "sbuser";
        String password = "KMmTKeK7yh77odw51gK12f";

        try {
            System.out.println("Connecting to database...");
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("Connection successful!");
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SHOW CREATE PROCEDURE sp_update_profile");
            if (rs.next()) {
                System.out.println("Procedure Definition: \n" + rs.getString("Create Procedure"));
            }
            conn.close();
        } catch (Exception e) {
            System.out.println("Error:");
            e.printStackTrace();
        }
    }
}
