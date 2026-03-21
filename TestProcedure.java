import java.sql.*;

public class TestProcedure {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:mariadb://34.47.168.236:7306/sabbpeapparels";
        String user = "sbuser";
        String password = "KMmTKeK7yh77odw51gK12f";
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            DatabaseMetaData dbmd = conn.getMetaData();
            ResultSet rs = dbmd.getProcedures(null, null, "sp_update_profile");
            while (rs.next()) {
                System.out.println("Found procedure: " + rs.getString("PROCEDURE_NAME"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
