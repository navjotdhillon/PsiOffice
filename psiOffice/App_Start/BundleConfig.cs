using System.Web;
using System.Web.Optimization;

namespace psiOffice
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));

            // bootstrap
            bundles.Add(new StyleBundle("~/Content/bs").Include("~/Content/bootstrap.css"));
            bundles.Add(new ScriptBundle("~/bundles/bs").Include("~/Scripts/bootstrap.js"));

            // KendoUI
            bundles.Add(new ScriptBundle("~/bundles/kendoui").Include("~/Scripts/Plugins/KendoUI/kendo.all.js"));
            bundles.Add(new StyleBundle("~/Content/kendoui")
                .Include("~/Content/Plugins/KendoUI/kendo.common.css")
                .Include("~/Content/Plugins/KendoUI/kendo.default.css")
                );

            // knockoutjs
            bundles.Add(new ScriptBundle("~/bundles/ko").Include("~/Scripts/knockout-{version}.js"));
        }
    }
}