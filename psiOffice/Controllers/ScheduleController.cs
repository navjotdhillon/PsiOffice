using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.IO;
using Newtonsoft.Json;

namespace psiOffice.Controllers
{
    public class ScheduleController : Controller
    {
        public ActionResult Index()
        {
            ScheduleVM vm = new ScheduleVM();

            vm.req = this.Req().data;
            vm.sch = this.Sch().data;
            vm.prod = this.Prod().data;

            return View(vm);
        }

        public OpReqVM Req()
        {
            string sUrl = "http://leanera.com/psiOfficeAPI/api/Schedule/OpRequest";
            String responseStr = FetchJsonFromAPI(sUrl, "");
            OpReqVM data = JsonConvert.DeserializeObject<OpReqVM>(responseStr);
            return data;
        }

        public OpSchVM Sch()
        {
            string sUrl = "http://leanera.com/psiOfficeAPI/api/Schedule/OpSchedule";
            String responseStr = FetchJsonFromAPI(sUrl, "");
            OpSchVM data = JsonConvert.DeserializeObject<OpSchVM>(responseStr);
            return data;
        }

        public OpProdVM Prod()
        {
            string sUrl = "http://leanera.com/psiOfficeAPI/api/Schedule/OpProduction";
            String responseStr = FetchJsonFromAPI(sUrl, "");
            OpProdVM data = JsonConvert.DeserializeObject<OpProdVM>(responseStr);
            return data;
        }

        protected String FetchJsonFromAPI(String sUrl, String para = "")
        {
            HttpWebRequest request = null;

            try
            {
                String reqUrl = sUrl;
                if (para.Length > 0)
                {
                    if (!para[0].Equals('?'))
                    {
                        para = "?" + para;
                    }
                }
                request = (HttpWebRequest)WebRequest.Create(reqUrl + para);

                request.Method = WebRequestMethods.Http.Get;
                request.Accept = "application/json";
                request.Timeout = 180000;
                //request.Credentials = CredentialCache.DefaultCredentials;

                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    using (Stream dataStream = response.GetResponseStream())
                    {
                        using (StreamReader reader = new StreamReader(dataStream))
                        {
                            String responseFromServer = reader.ReadToEnd();

                            return responseFromServer;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                if (request != null)
                {
                    request.Abort();
                }

                throw ex;
            }
        }

    }

    public class ScheduleVM
    {
        public List<OpReqDataVM> req { get; set; }
        public List<OpSchDataVM> sch { get; set; }
        public List<OpProdDataVM> prod { get; set; }
    }

    public class OpReqVM
    {
        public Boolean success { get; set; }
        public string message { get; set; }
        public List<OpReqDataVM> data { get; set; }
    }

    public class OpReqDataVM
    {
        public decimal? issue_no { get; set; }
        public string issue_subject { get; set; }
        public string customer { get; set; }
        public string owner { get; set; }
        public string owner_name { get; set; }
        public decimal? estimate_time { get; set; }
        public DateTime? due_date { get; set; }
        public decimal? invoice_flag { get; set; }
        public decimal? issue_priority { get; set; }
        public int? c_days_stage { get; set; }
        public decimal? seq_no { get; set; }
    }

    public class OpSchVM
    {
        public Boolean success { get; set; }
        public string message { get; set; }
        public List<OpSchDataVM> data { get; set; }
    }

    public class OpSchDataVM
    {
        public decimal? issue_no { get; set; }
        public string issue_subject { get; set; }
        public string customer { get; set; }
        public string owner { get; set; }
        public string owner_name { get; set; }
        public decimal? estimate_time { get; set; }
        public DateTime? est_start_date { get; set; }
        public DateTime? est_end_date { get; set; }
        public DateTime? due_date { get; set; }
        public int? hard_alloc { get; set; }
        public string earmarked_for { get; set; }
        public string earmarked_name { get; set; }
        public string design_status { get; set; }
        public int? c_days_stage { get; set; }
        public int? c_days_early { get; set; }
        public int? c_ontime_status { get; set; }
        public decimal? seq_no { get; set; }
    }

    public class OpProdVM
    {
        public Boolean success { get; set; }
        public string message { get; set; }
        public List<OpProdDataVM> data { get; set; }
    }

    public class OpProdDataVM
    {
        public decimal? issue_no { get; set; }
        public string issue_subject { get; set; }
        public string customer { get; set; }
        public decimal? estimate_time { get; set; }
        public decimal? est_complete_pct { get; set; }
        public decimal? reported_hours { get; set; }
        public DateTime? due_date { get; set; }
        public int? c_days_stage { get; set; }
        public string production_stage { get; set; }
    }

}
